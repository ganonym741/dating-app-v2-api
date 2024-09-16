/* eslint-disable @typescript-eslint/consistent-type-imports */
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';

import { TOKEN_SESSION_TTL, USER_SESSION_PREFIX } from '@core/utils/const';
import type {
  DataWithStatusRes,
} from '@core/type/response.type';

import type { LoginDto, TokenDto } from './dto/auth.dto';
import { LoginResponseDto } from './dto/auth.dto';
import { UserEntity } from '@model/user.entity';
import { RedisCacheService } from '@core/utils/caching';
import { UserSession, UserTokenRaw } from '@core/type/session.type';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity) private userRepo: Repository<UserEntity>,
    private readonly jwtService: JwtService,
    private readonly cacheService: RedisCacheService
  ) {}

  async login(payload: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = payload;

    // Verify user credentials
    const userData = await this.userRepo.findOne({
      select: [
        '_id',
        'name',
        'password',
        'birth_date',
        'membership',
        'city',
        'email',
        'photo',
        'phone_number',
        'province',
        'profile_desc',
        'gender',
      ],
      where: [{ username: username }, { email: username }],
    });

    if (!userData) {
      throw new UnauthorizedException('Email atau password tidak valid');
    }

    const check = await this.compareHash(password, userData.password);

    if (!check) {
      throw new UnauthorizedException('Email atau password tidak valid');
    }

    // Generate user token
    const token = await this.createToken({
      _id: userData._id,
      membership: userData.membership,
    });

    // Save login session to redis
    const decoded = jwt.decode(token);

    await this.cacheService.save(
      `${USER_SESSION_PREFIX}${userData._id}`,
      JSON.stringify({
        _id: userData._id,
        membership: userData.membership,
        login_at: new Date(),
        iat: decoded['iat'],
      }),
      TOKEN_SESSION_TTL
    );

    const data = userData;

    delete data.password;
    delete data['tempPassword'];

    return {
      jwt: {
        token: token,
        token_expired: new Date(decoded['exp'] * 1000),
      },
      ...data,
    };
  }

  async logout(user: UserSession): Promise<DataWithStatusRes<object>> {
    // Delete user session
    await this.cacheService.delete(`${USER_SESSION_PREFIX}${user._id}`);

    return {
      status_description: 'Logout berhasil!',
      data: {},
    };
  }

  async refreshToken(user: UserSession): Promise<TokenDto> {
    // Generate new user token
    const token = await this.createToken({
      _id: user._id,
      membership: user.membership,
    });

    // Save login session to redis
    const decoded = jwt.decode(token);

    await this.cacheService.save(
      `${USER_SESSION_PREFIX}${user._id}`,
      JSON.stringify({ ...user, iat: decoded['iat'] }),
      TOKEN_SESSION_TTL
    );

    return {
      token: token,
      token_expired: new Date(decoded['exp'] * 1000),
    };
  }

  async createToken(payload: UserTokenRaw): Promise<string> {
    return await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_SECRET_SALT,
      expiresIn: +process.env.JWT_MAX_AGE,
    });
  }

  private async compareHash(
    password: string | undefined,
    hash: string | undefined
  ): Promise<boolean> {
    try {
      return bcrypt.compare(password, hash);
    } catch (e) {
      console.log('error : ', e);

      return false;
    }
  }
}
