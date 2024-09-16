import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Response,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';

import { SwaggerMetaResponse } from '@core/type/response.type';
import { JwtAuthGuard } from '@core/guards';
import { MapResponseSwagger } from '@core/utils/helper';

// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { AuthService } from '@/auth/auth.service';
import type { LoginDto } from '@/auth/dto/auth.dto';
import { LoginResponseDto, TokenDto } from '@/auth/dto/auth.dto';

@Controller()
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Login' })
  @MapResponseSwagger(LoginResponseDto, { status: 200, isArray: false })
  @Post('/login')
  async login(@Request() req, @Body() body: LoginDto, @Response() res) {
    try {
      const data = await this.authService.login(body);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Refresh token' })
  @MapResponseSwagger(TokenDto, { status: 200, isArray: false })
  @ApiBearerAuth()
  @Get('/token/refresh')
  @UseGuards(JwtAuthGuard)
  async refreshToken(@Request() req, @Response() res) {
    try {
      const data = await this.authService.refreshToken(req.user);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Logout User' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @ApiBearerAuth()
  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req, @Response() res) {
    try {
      const data = await this.authService.logout(req.user);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }
}
