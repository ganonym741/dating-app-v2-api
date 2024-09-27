import { BadRequestException, FileTypeValidator, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { ObjectId, Repository } from 'typeorm';

import type { CreateAlbumDto } from './dto/create-album.dto';
import type { UpdateAlbumDto } from './dto/update-album.dto';
import { AlbumEntity } from '@model/album.entity';
import type { UserSession } from '@core/type/session.type';
import { uploadFile } from '@core/utils/upload';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity) private albumRepo: Repository<AlbumEntity>
  ) {}

  async create(files: any, createAlbumDto: CreateAlbumDto, user: UserSession) {
    const timestamp = Date.now();

    if (!(files?.name.length > 0)) {
      throw new BadRequestException('Must have at least 1 image');
    }

    const fileValidator = new FileTypeValidator({
      fileType: /(jpg|jpeg|png|webp)$/
    });

    const photo = await files.name.reduce(async (acc: { [x: string]: any; }, file: any, index: number) => {
      if (!fileValidator.isValid(file)) {
        throw new BadRequestException(
          'File format not supported. Supported file format: (jpg/png/pdf/webp)'
        );
      }

      const filePath = await uploadFile(files.name[0], `album/album-${timestamp}`);

      acc[`photo_${index + 1}`] = filePath;

      return acc;
    }, Promise.resolve({} as { [key: string]: string }));
    
    const result = await this.albumRepo.save({
      ...createAlbumDto,
      ...photo,
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

  async update(userId: ObjectId, _id: ObjectId, updateAlbumDto: UpdateAlbumDto) {
    const result = (await this.albumRepo.update({ _id: _id, user_id: userId }, updateAlbumDto))
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
