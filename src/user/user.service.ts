/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, MoreThan, Not, ObjectId, type Repository } from 'typeorm';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { MEMBERSHIP, UserEntity } from '@model/user.entity';
import type { GetManyUserDto } from './dto/get-user.dto';
import { VIEW_SESSION_PREFIX } from '@core/utils/const';
import { RedisCacheService } from '@core/utils/caching';
import { UserSession } from '@core/type/session.type';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private readonly cacheService: RedisCacheService
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = this.userRepo.create(createUserDto);
    const result = await this.userRepo.save(user).catch((err: Error) => {
      throw new BadRequestException(
        err.message?.includes('duplicate')
          ? 'Username atau email sudah terdaftar'
          : err.message
      );
    });

    if (result._id) return 'Registrasi user sukses';
  }

  async findMany(user: UserSession, params: GetManyUserDto) {
    const except = (
      await this.cacheService.getKeys(VIEW_SESSION_PREFIX + user._id + ':*')
    ).map((item) => item.split(':').at(-1));

    except.push(user._id.toString());

    if (user.membership === MEMBERSHIP.Basic && except.length >= 10)
      throw new ForbiddenException(
        'Upgrade user anda untuk melihat lebih banyak.'
      );

    const result = await this.userRepo.find({
      where: {
        ...(params.gender && { gender: params.gender }),
        ...(params.maxAge && {
          birth_date: MoreThan(
            new Date(
              new Date().setFullYear(new Date().getFullYear() - params.maxAge)
            )
          ),
        }),
        ...(params.city && { city: params.city }),
        ...(params.province && { province: params.province }),
        ...(except.length > 0 && { id: Not(In(except)) }),
      },
      take: 10,
    });

    return result;
  }

  async findOne(_id: ObjectId) {
    return await this.userRepo.findOne({
      where: { _id: _id },
      select: { created_at: false, updated_at: false, deleted_at: false },
    });
  }

  async update(_id: ObjectId, updateUserDto: UpdateUserDto) {
    const result = (await this.userRepo.update({ _id: _id }, updateUserDto))
      .affected;

    if (result === 0) {
      throw new NotFoundException('User tidak ditemukan');
    } else {
      return 'Data user berhasil di update';
    }
  }

  async remove(_id: ObjectId) {
    const result = (await this.userRepo.delete({ _id: _id })).affected;

    if (result === 0) {
      throw new NotFoundException('User tidak ditemukan');
    } else {
      return 'User berhasil di hapus';
    }
  }
}
