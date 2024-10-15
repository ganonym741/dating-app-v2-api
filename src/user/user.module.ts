import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';

import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserEntity } from '@model/user.entity';
import { RedisCacheService } from '@core/utils/caching';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    MulterModule.register({
      storage: multer.memoryStorage(),
      limits: { fileSize: 5000000 },
    }),
  ],
  controllers: [UserController],
  providers: [UserService, RedisCacheService],
})
export class UserModule {}
