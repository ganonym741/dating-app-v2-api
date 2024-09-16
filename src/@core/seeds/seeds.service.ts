import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { UserEntity } from '@model/user.entity';
import { UserSeed } from '@/migrations/seeds/user.seeds';

@Injectable()
export class Seeder {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>
  ) {}

  async createDummyUser() {
    try {
      for (const data of UserSeed) {

        const dataUser = this.userRepo.create(data)

        await this.userRepo.save(dataUser);
      }
    } catch (error: any) {
      console.log('Create Dummy User Failed. Detail: ', error.message);
    }
  }
}
