import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { AlbumEntity } from '@model/album.entity';
import { RedisCacheService } from '@core/utils/caching';

@Module({
  imports: [TypeOrmModule.forFeature([AlbumEntity]),
  MulterModule.register({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5000000 },
  })],
  controllers: [AlbumController],
  providers: [AlbumService, RedisCacheService],
})
export class AlbumModule {}
