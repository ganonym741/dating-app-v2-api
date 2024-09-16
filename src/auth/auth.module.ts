import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { LocalStrategy } from './local.strategy';
import { UserEntity } from '@model/user.entity';
import { TOKEN_SESSION_TTL } from '@core/utils/const';
import { RedisCacheService } from '@core/utils/caching';

@Module({
  imports: [
    PassportModule,
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      secret: process.env.JWT_KEY,
      signOptions: { expiresIn: TOKEN_SESSION_TTL },
    }),
  ],
  providers: [
    AuthService,
    JwtService,
    LocalStrategy,
    JwtStrategy,
    RedisCacheService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
