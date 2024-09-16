import { ApiProperty } from '@nestjs/swagger';

import type { GENDER } from '@model/user.entity';

export class GetManyUserDto {
  @ApiProperty({ example: 'Male | Female' })
  gender?: GENDER;

  @ApiProperty({ example: 24 })
  maxAge?: number;

  @ApiProperty({ example: 'Banyumas' })
  city?: string;

  @ApiProperty({ example: 'Jawa Tengah' })
  province?: string;
}
