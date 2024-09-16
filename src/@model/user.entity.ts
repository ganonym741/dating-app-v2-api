import type {
  ObjectId} from 'typeorm';
import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  BeforeInsert,
  BeforeUpdate,
  DeleteDateColumn,
  ObjectIdColumn
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import * as bcrypt from 'bcrypt';
import { IsDateString, IsEmail, IsEnum, IsNotEmpty, Matches } from 'class-validator';

import { PASSSWORD_REGEX } from '@core/utils/const';
import type { ChineseZodiac, ZodiacSign } from '@core/type/horoscope.type';
import { HoroscopeGenerator } from '@core/utils/gen-horoscope';

export enum GENDER {
  'Male' = 'Male',
  'Female' = 'Female',
}

export enum MEMBERSHIP {
  'Basic' = 'Basic',
  'Premium' = 'Premium',
}

@Entity('user')
export class UserEntity {
  @ApiProperty({ type: String, example: 'xxxxx' })
  @ObjectIdColumn()
  _id: ObjectId
  
  @ApiProperty({ example: true })
  @Column({ nullable: false, default: false })
  is_online: boolean;

  @ApiProperty({ example: 'Nama User' })
  @Column()
  @IsNotEmpty({message: 'Nama harus diisi'})
  name: string;

  @ApiProperty({ example: 'email@example.com' })
  @Column({ unique: true })
  @IsNotEmpty({message: 'Email harus diisi'})
  @IsEmail({}, { message: 'Email tidak valid' })
  email: string;

  @ApiProperty({ example: 'Username' })
  @Column({ unique: true, nullable: true })
  username: string;

  @ApiProperty({ example: 'Password' })
  @Column({ select: false })
  @Matches(PASSSWORD_REGEX, {
    message:
      'Password harus lebih dari 12 karakter, memiliki minimal 1 huruf kapital, 1 simbol, dan 1 angka.',
  })
  password: string;

  @ApiProperty({ example: 'name123' })
  @Column({ unique: true, nullable: false })
  tag: string;

  @ApiProperty({ example: '12-07-1990' })
  @Column()
  @IsDateString({}, { message: 'Tanggal lahir tidak valid' })
  birth_date: Date;

  @ApiProperty({ example: 'M' })
  @Column()
  @IsEnum(GENDER, { message: 'Jenis Kelamin tidak valid' })
  gender: GENDER;

  @ApiProperty({ example: 163 })
  @Column({ nullable: true })
  height: number;

  @ApiProperty({ example: 55 })
  @Column({ nullable: true })
  weight: number;

  @ApiProperty({ example: 'address' })
  @Column()
  address: string;

  @ApiProperty({ example: 'city' })
  @Column()
  city: string;

  @ApiProperty({ example: 'province' })
  @Column()
  province: string;

  @ApiProperty({ example: 'M' })
  @Column()
  photo: string;

  @ApiProperty({ example: 'Profile Description' })
  @Column('text', { nullable: true })
  profile_desc: string;

  @ApiProperty({ example: 'Phone Number' })
  @Column({ nullable: true, unique: true })
  phone_number: string;

  @ApiProperty({ example: ['reading', 'gym'] })
  @Column({ nullable: true })
  interest: string[];

  @ApiProperty({ example: 'Cancer' })
  @Column('text', { nullable: true })
  zodiac_sign: ZodiacSign;

  @ApiProperty({ example: 'Dragon' })
  @Column('text', { nullable: true })
  chinese_zodiac: ChineseZodiac;

  @ApiProperty({ example: 'basic | premium' })
  @Column()
  @IsEnum(MEMBERSHIP, { message: 'Membership tidak valid' })
  membership: MEMBERSHIP;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamptz' })
  deleted_at: Date;

  @BeforeInsert()
  genTagIfNotExist() {
    if (!this.tag) {
      this.tag =
        `${this.name.replace(' ','').slice(0, 6)}${Math.floor(Math.random() * (100000 - 999999 + 1) + 100000)}`;
    }
  }

  @BeforeUpdate()
  @BeforeInsert()
  async interceptWriteAction() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }

    if (this.birth_date) {
      const horoscope = new HoroscopeGenerator(this.birth_date).generate();

      this.chinese_zodiac = horoscope.chineseZodiac;
      this.zodiac_sign = horoscope.horoscope;
    }
  }
}
