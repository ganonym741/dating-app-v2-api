import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { ObjectId, Repository } from 'typeorm';

import type { CreateAlbumDto } from './dto/create-album.dto';
import type { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from '@model/album.entity';
import type { UserSession } from '@core/type/session.type';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity) private albumRepo: Repository<AlbumEntity>
  ) {}

  async create(createAlbumDto: CreateAlbumDto, user: UserSession) {
    const result = await this.albumRepo.save({
      ...createAlbumDto,
      user_id: user._id,
    });

    if (result._id) return 'Album berhasil ditambahkan!';
  }

  async findByUserId(userId: ObjectId) {
    const result = await this.albumRepo.find({
      where: {
        user_id: userId,
      },
    });

    return result;
  }

  async update(_id: ObjectId, updateAlbumDto: UpdateAlbumDto) {
    const result = (await this.albumRepo.update({ _id: _id }, updateAlbumDto))
      .affected;

    if (result === 0) {
      throw new NotFoundException('Album tidak ditemukan');
    } else {
      return 'Data user berhasil di update';
    }
  }

  async remove(_id: ObjectId) {
    const result = (await this.albumRepo.delete({ _id: _id })).affected;

    if (result === 0) {
      throw new NotFoundException('Album tidak ditemukan');
    } else {
      return 'Album berhasil di hapus';
    }
  }
}
