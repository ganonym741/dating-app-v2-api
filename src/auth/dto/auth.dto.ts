import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import type { ObjectId } from 'typeorm';

import type { GENDER } from '@model/user.entity';

export class LoginDto {
  @ApiProperty({ name: 'username', example: 'xxxxxxxx', required: true })
  @IsString({ message: 'Username tidak boleh kosong.' })
  username: string;

  @ApiProperty({ name: 'password', example: 'xxxxxxxx', required: true })
  @IsString({ message: 'Password tidak boleh kosong.' })
  password: string;
}

export class TokenDto {
  @ApiProperty({ example: 'base64 token' })
  token: string;

  @ApiProperty({ example: '124000' })
  token_expired: Date;
}

export class LoginResponseDto {
  @ApiProperty()
  jwt: TokenDto;

  @ApiProperty({ type: String, example: 'xxxxx' })
  _id: ObjectId;

  @ApiProperty({ example: 'Nama User' })
  name: string;

  @ApiProperty({ example: 'email@example.com' })
  email: string;

  @ApiProperty({ example: '12-07-1990' })
  birth_date: Date;

  @ApiProperty({ example: 'M' })
  gender: GENDER;

  @ApiProperty({ example: 'address' })
  address: string;

  @ApiProperty({ example: 'photo address' })
  photo: string;

  @ApiProperty({ example: 'Deskripsi profile' })
  profile_desc: string;

  @ApiProperty({ example: 'Phone Number' })
  phone_number: string;
}
