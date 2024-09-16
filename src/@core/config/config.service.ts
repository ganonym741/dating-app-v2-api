import * as path from 'path';

import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import type { LogLevel } from '@nestjs/common/services';

import { parseLogLevel } from '../logger/logger.service';
import { TOKEN_REFRESH_TTL, TOKEN_SESSION_TTL } from '../utils/const';

// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config();

export enum Environment {
  Local = 'local',
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  public getValue(key: string, throwOnMissing = true) {
    const value = this.env[key];

    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));

    return this;
  }

  public isProduction() {
    const mode = this.getValue('NODE_ENV', false);

    return mode === Environment.Production;
  }

  public getEnv(env: string) {
    if (Object.keys(Environment).includes(env as Environment)) {
      return env;
    }

    throw new Error(
      `NODE_ENV value not valid, must typeof ${Object.keys(Environment).toString().replace(',', '/')}`
    );
  }

  public getAppConfig() {
    return {
      env: this.getValue('NODE_ENV') ?? 'Local',
      port: parseInt(this.getValue('PORT')),
      tz: this.getValue('TZ', false) ?? 'Asia/Jakarta',
      appName: this.getValue('APP_NAME', false) ?? 'dating-apps',
      baseUrl: this.getValue('BASE_URL', false) ?? 'http://localhost:3000',
      loggerLevel: parseLogLevel(
        this.getValue('APP_LOGGER_LEVEL', false) ??
          'log,error,warn,debug,verbose'
      ) as LogLevel[],
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      version: require(path.join(process.cwd(), 'package.json')).version,
    };
  }

  public getSecretConfig() {
    return {
      algorithm: this.getValue('ALGORITHM'),
      key: this.getValue('DECRYPT_SECRET_KEY'),
      iv: this.getValue('DECRYPT_IV'),
    };
  }

  public getJWTConfig() {
    return {
      secret: this.getValue('JWT_SECRET'),
      audience: this.getValue('JWT_TOKEN_AUDIENCE'),
      issuer: this.getValue('JWT_TOKEN_ISSUER'),
      accessTokenTtl: parseInt(
        this.getValue('JWT_ACCESS_TOKEN_TTL') ?? TOKEN_SESSION_TTL.toString(),
        10
      ),
      refreshTokenTtl: parseInt(
        this.getValue('JWT_REFRESH_TOKEN_TTL') ?? TOKEN_REFRESH_TTL.toString(),
        10
      ),
    };
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'mongodb',
      name: 'default',
      host: this.getValue('MONGOOSE_HOST'),
      port: parseInt(this.getValue('MONGOOSE_PORT', false) ?? '27017'),
      username: this.getValue('MONGOOSE_USER'),
      password: this.getValue('MONGOOSE_PASSWORD'),
      database: this.getValue('MONGOOSE_DATABASE'),
      useUnifiedTopology: true,
      useNewUrlParser: true,

      entities: ['dist/**/*.entity.{js,ts}'],
      migrationsTableName: 'migrations',
      migrations: ['dist/migrations/*.{ts,js}'],
      synchronize: true,
      ssl: false,
      authSource: 'admin',
      logging: !this.isProduction(),
    };
  }

  public getRedisConfig() {
    return {
      host: this.getValue('REDIS_HOST'),
      port: parseInt(this.getValue('REDIS_PORT') ?? '6379', 10),
    };
  }

  public getSwaggerConfig() {
    return {
      password: this.getValue('SWAGGER_PASSWORD'),
    };
  }
}

export const configService = new ConfigService(process.env).ensureValues([
  'MONGOOSE_HOST',
  'MONGOOSE_PORT',
  'MONGOOSE_USER',
  'MONGOOSE_PASSWORD',
  'MONGOOSE_DATABASE',
  'REDIS_HOST',
  'REDIS_PORT',
  'JWT_SECRET',
  'JWT_TOKEN_AUDIENCE',
  'JWT_TOKEN_ISSUER',
  'ALGORITHM',
  'DECRYPT_SECRET_KEY',
  'DECRYPT_IV',
  'NODE_ENV',
  'PORT',
  'SWAGGER_PASSWORD',
]);
