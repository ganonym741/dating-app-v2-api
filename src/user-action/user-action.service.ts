/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { ObjectId, Repository } from 'typeorm';

import { UserLikeEntity } from '@model/user-like.entity';
import { UserViewEntity } from '@model/user-view.entity';
import { AlbumLikeEntity } from '@model/album-like.entity';
import { AlbumEntity } from '@model/album.entity';
import { MEMBERSHIP } from '@model/user.entity';
import { RedisCacheService } from '@core/utils/caching';
import { VIEW_SESSION_PREFIX, VIEW_SESSION_TTL } from '@core/utils/const';
import { UserSession } from '@core/type/session.type';

@Injectable()
export class UserActionService {
  constructor(
    @InjectRepository(UserLikeEntity)
    private userLikeRepo: Repository<UserLikeEntity>,
    @InjectRepository(UserViewEntity)
    private userViewRepo: Repository<UserViewEntity>,
    @InjectRepository(AlbumLikeEntity)
    private albumLikeRepo: Repository<AlbumLikeEntity>,
    @InjectRepository(AlbumEntity)
    private albumRepo: Repository<AlbumEntity>,
    private readonly cacheService: RedisCacheService
  ) {}

  async likeUser(req: UserSession, userId: ObjectId) {
    let response = 'Sukses membatalkan menyukai user';

    const existingUser = await this.userLikeRepo.findOne({
      where: {
        user_id: userId,
        liked_by_id: req._id,
      },
      withDeleted: true,
    });

    if (existingUser.deleted_at) {
      response = 'Sukses menyukai user';
    }

    if (existingUser) {
      // If found, update the existing user
      await this.userLikeRepo.update(existingUser._id, {
        ...(existingUser.deleted_at
          ? { created_at: new Date(), deleted_at: null }
          : { deleted_at: new Date() }),
      });
    } else {
      // If not found, insert a new user
      await this.userLikeRepo.save({
        user_id: userId,
        liked_by_id: req._id,
      });
    }

    return response;
  }

  async viewUser(req: UserSession, userId: ObjectId) {
    const except = (
      await this.cacheService.getKeys(VIEW_SESSION_PREFIX + '*:' + req._id)
    ).map((item) => item.split(':').at(1));

    if (except.includes(userId.toString()))
      throw new BadRequestException('User ini sudah anda lihat sebelumnya');
    if (req._id === userId)
      throw new BadRequestException('User ini tidak valid');

    await this.userViewRepo.save({
      user_id: userId,
      viewed_by_id: req._id,
      created_at: new Date(),
    });

    await this.cacheService.save(
      `${VIEW_SESSION_PREFIX}${userId}:${req._id}`,
      '-',
      VIEW_SESSION_TTL
    );

    return 'User viewed';
  }

  async likeAlbum(req: UserSession, albumId: ObjectId) {
    let response = 'Sukses membatalkan menyukai album';

    const existingAlbum = await this.albumLikeRepo.findOne({
      where: {
        album_id: albumId,
        liked_by_id: req._id,
      },
      withDeleted: true,
    });

    if (existingAlbum.deleted_at) {
      response = 'Sukses menyukai album';
    }

    if (existingAlbum) {
      await this.albumRepo.update(albumId, {
        like: () => `like ${existingAlbum.deleted_at ? '+ 1' : '- 1'}`,
      });
      await this.albumLikeRepo.update(existingAlbum._id, {
        ...(existingAlbum.deleted_at
          ? { created_at: new Date(), deleted_at: null }
          : { deleted_at: new Date() }),
      });
    } else {
      // If not found, insert a new album-like
      await this.albumLikeRepo.save({
        album_id: albumId,
        liked_by_id: req._id,
      });
    }

    return response;
  }

  async viewUserLike(req: UserSession) {
    if (req.membership === MEMBERSHIP.Basic)
      throw new ForbiddenException(
        'Upgrade user anda untuk bisa melihat fans anda.'
      );

    const result = await this.userLikeRepo.find({
      where: {
        user_id: req._id,
      },
    });

    return result;
  }

  async viewUserView(req: UserSession) {
    if (req.membership === MEMBERSHIP.Basic)
      throw new ForbiddenException(
        'Upgrade user anda untuk bisa melihat pengagum anda.'
      );

    const result = await this.userViewRepo.find({
      where: {
        user_id: req._id,
      },
    });

    return result;
  }

  async viewAlbumLike(req: UserSession, albumId: ObjectId) {
    const album = await this.albumRepo.findOne({ where: { _id: albumId } });

    if (album.user_id === req._id)
      throw new ForbiddenException(
        'Anda tidak di izinkan melihat detail like album'
      );

    if (req.membership === MEMBERSHIP.Basic)
      throw new ForbiddenException(
        'Upgrade user anda untuk bisa melihat penyuka album anda.'
      );

    const result = await this.albumLikeRepo.find({
      where: {
        album_id: albumId,
      },
    });

    return result;
  }
}
