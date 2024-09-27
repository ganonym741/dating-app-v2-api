import { NestFactory } from '@nestjs/core';

import * as basicAuth from "express-basic-auth";
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded } from 'express';
import helmet from 'helmet';
import * as setTZ from 'set-tz';
import type { VersioningOptions} from '@nestjs/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from '@/app.module';
import { ExceptionFilters } from '@core/filter/exception.filter';
import { configService } from './@core/config/config.service';

async function bootstrap() {
  const appCfg = configService.getAppConfig();

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_HOST,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  });

  app.setGlobalPrefix('api');

  {
    /**
     * loggerLevel: 'error' | 'warn' | 'log' | 'verbose' | 'debug' | 'silly';
     * https://docs.nestjs.com/techniques/logger#log-levels
     */

    // app.useLogger(appCfg.loggerLevel);
  }

  {
    /**
     * Enable versioning for all routes
     * https://docs.nestjs.com/openapi/multiple-openapi-documents#versioning
     */
    const options: VersioningOptions = {
      type: VersioningType.URI,
      defaultVersion: '1',
    };

    app.enableVersioning(options);
  }

  {
    /**
     * Setup Swagger API documentation
     * https://docs.nestjs.com/openapi/introduction
     */

    if (!configService.isProduction()) {  
      app.use(
        "/docs*",
        basicAuth({
          challenge: true,
          users: {
            admin: "admin123",
          },
        })
      );

      const config = new DocumentBuilder()
        .setTitle('Dating App - Api')
        .setDescription('Endpoint for dating apps')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
      const document = SwaggerModule.createDocument(app, config);
  
      SwaggerModule.setup('/docs', app, document);
    }
  }

  {
    /**
     * Help secure Express apps by setting HTTP response headers.
     * https://github.com/helmetjs/helmet
     */

    app.use(
      helmet({
        contentSecurityPolicy: true,
        noSniff: true,
        xssFilter: true,
        strictTransportSecurity: configService.isProduction(),
      })
    );
  }

  {
    /**
     * Help validate property payload.
     */

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  }
  
  // set default local timezone
  setTZ(appCfg.tz);

  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.useGlobalFilters(new ExceptionFilters());

  await app.listen(appCfg.port);
}

bootstrap();

