/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { OnApplicationBootstrap } from '@nestjs/common';
import { Controller } from '@nestjs/common';

import { Seeder } from '@core/seeds/seeds.service';

@Controller()
export class AppController implements OnApplicationBootstrap {
  constructor(public seeder: Seeder) {}

  async onApplicationBootstrap() {
    await this.seeder.createDummyUser();
  }
}
