import { NestFactory } from '@nestjs/core';
import basicAuth from 'express-basic-auth';

import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { urlencoded } from 'express';
import helmet from 'helmet';
import * as setTZ from 'set-tz';
import type { VersioningOptions} from '@nestjs/common';
import { ValidationPipe, VersioningType } from '@nestjs/common';

import { AppModule } from '@/app.module';
import { ExceptionFilters } from '@core/filter/exception.filter';
import { configService } from './@core/config/config.service';
import { BasicAuthMiddleware } from '@core/middleware/basic-auth.middleware';

async function bootstrap() {
  const appCfg = configService.getAppConfig();

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: process.env.CLIENT_HOST,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    },
  });

  {
    /**
     * loggerLevel: 'error' | 'warn' | 'log' | 'verbose' | 'debug' | 'silly';
     * https://docs.nestjs.com/techniques/logger#log-levels
     */

    app.useLogger(appCfg.loggerLevel);
  }

  {
    /**
     * Enable versioning for all routes
     * https://docs.nestjs.com/openapi/multiple-openapi-documents#versioning
     */
    const options: VersioningOptions = {
      type: VersioningType.URI,
      defaultVersion: 'v1',
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
        ['/docs'],
        BasicAuthMiddleware,
      );
      
      const config = new DocumentBuilder()
        .setTitle('Dating App - Api')
        .setDescription('Endpoint for dating apps')
        .setVersion('1.0')
        .addTag('Dating App')
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
  
  // set default local timezone
  setTZ(appCfg.tz);

  app.useGlobalPipes(new ValidationPipe({transform: true}));
  app.use(urlencoded({ limit: '100mb', extended: true }));
  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ExceptionFilters());

  await app.listen(appCfg.port);
}

bootstrap();

