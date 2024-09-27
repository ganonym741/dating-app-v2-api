/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Put,
  Request,
  UseGuards,
  Query,
  Response,
  UseInterceptors,
  UploadedFiles,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { plainToInstance } from 'class-transformer';

import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '@core/guards';
import type { GetManyUserDto } from './dto/get-user.dto';
import { MapResponseSwagger } from '@core/utils/helper';
import { UserEntity } from '@model/user.entity';
import { SwaggerMetaResponse } from '@core/type/response.type';

@ApiTags('User Api')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Register user' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Post('/register')
  async create(@Body() createUserDto: CreateUserDto, @Response() res) {
      const payload = plainToInstance(CreateUserDto, createUserDto);
      const data = await this.userService.create(payload);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: data,
      });
  }

  @ApiOperation({ summary: 'Add user photo' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: 'photo', maxCount: 1 },
    ])
  )
  async addPhotoUser(@Req() req, @UploadedFiles() files, @Response() res) {
    const result = await this.userService.addPhotoUser(req.user, files);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: result,
      });
  }

  @ApiOperation({ summary: 'Find many user' })
  @MapResponseSwagger(UserEntity, { status: 200, isArray: true })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(
    @Request() req,
    @Query() query: GetManyUserDto,
    @Response() res
  ) {
      const data = await this.userService.findMany(req.user, query);

      return res.status(HttpStatusCode.Ok).json({data});
  }

  @ApiOperation({ summary: 'Get user profile' })
  @MapResponseSwagger(UserEntity, { status: 200, isArray: false })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/profile')
  async findOne(@Request() req, @Response() res) {
      const data = await this.userService.findOne(req.user._id);

      return res.status(HttpStatusCode.Ok).json({data});
  }

  @ApiOperation({ summary: 'Edit user data' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Put()
  async update(
    @Request() req,
    @Body() updateUserDto: UpdateUserDto,
    @Response() res
  ) {
      const result = await this.userService.update(req.user._id, updateUserDto);

      return res.status(HttpStatusCode.Created).json({
        status_description: result,
      });
  }

  @ApiOperation({ summary: 'Delete account' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete()
  async remove(@Request() req, @Response() res) {
      const result = await this.userService.remove(req.user._id);

      return res.status(HttpStatusCode.Created).json({
        status_description: result,
      });
  }
}
