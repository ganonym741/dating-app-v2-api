/* eslint-disable @typescript-eslint/consistent-type-imports */
import {
  Controller,
  Post,
  Param,
  UseGuards,
  Request,
  Response,
  Put,
  Get,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
} from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { ObjectId } from 'typeorm';

import { UserActionService } from './user-action.service';
import { JwtAuthGuard } from '@core/guards';
import { SwaggerMetaResponse } from '@core/type/response.type';
import { MapResponseSwagger } from '@core/utils/helper';
import { AlbumLikeEntity } from '@model/album-like.entity';
import { UserLikeEntity } from '@model/user-like.entity';
import { UserViewEntity } from '@model/user-view.entity';

@ApiTags('User Action Api')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('action')
export class UserActionController {
  constructor(private readonly userActionService: UserActionService) {}

  @ApiOperation({ summary: 'User like action service' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Put('/user-like/:_id')
  async likeUser(@Request() req, @Param('_id') _id: ObjectId, @Response() res) {
    try {
      const data = await this.userActionService.likeUser(req.user, _id);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: data,
      });
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'User view action service' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Post('/user-view/:_id')
  async viewUser(@Request() req, @Param('_id') _id: ObjectId, @Response() res) {
    try {
      const data = await this.userActionService.viewUser(req.user, _id);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: data,
      });
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Album like action service' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Put('/album-like/:_id')
  async likeAlbum(@Request() req, @Param('_id') _id: ObjectId, @Response() res) {
    try {
      const data = await this.userActionService.likeAlbum(req.user, _id);

      return res.status(HttpStatusCode.Created).json({
        status_code: HttpStatusCode.Created,
        status_description: data,
      });
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Lihat penyuka user' })
  @MapResponseSwagger(UserLikeEntity, {
    status: 200,
    isArray: true,
  })
  @Get('my-fans')
  async viewUserLike(@Request() req, @Response() res) {
    try {
      const data = await this.userActionService.viewUserLike(req.user);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Lihat fans rahasia user' })
  @MapResponseSwagger(UserViewEntity, {
    status: 200,
    isArray: true,
  })
  @Get('/my-viewer')
  async viewUserView(@Request() req, @Response() res) {
    try {
      const data = await this.userActionService.viewUserView(req.user);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }

  @ApiOperation({ summary: 'Lihat penyuka album user' })
  @MapResponseSwagger(AlbumLikeEntity, {
    status: 200,
    isArray: true,
  })
  @Get('/album-like/:_id')
  async viewAlbumLike(
    @Request() req,
    @Param('_id') _id: ObjectId,
    @Response() res
  ) {
    try {
      const data = await this.userActionService.viewAlbumLike(req.user, _id);

      return res.status(HttpStatusCode.Ok).json(data);
    } catch (err) {
      throw err;
    }
  }
}
