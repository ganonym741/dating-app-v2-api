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
  Query,
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
      const result = await this.userActionService.likeUser(req.user, _id);

      return res.status(HttpStatusCode.Created).json({
        status_description: result,
      });
  }

  @ApiOperation({ summary: 'User view action service' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Post('/user-view/:_id')
  async viewUser(@Request() req, @Param('_id') _id: ObjectId, @Response() res) {
      const result = await this.userActionService.viewUser(req.user, _id);

      return res.status(HttpStatusCode.Created).json({
        status_description: result,
      });
  }

  @ApiOperation({ summary: 'Album like action service' })
  @ApiOkResponse({
    status: 200,
    type: SwaggerMetaResponse,
  })
  @Put('/album-like/:_id')
  async likeAlbum(@Request() req, @Param('_id') _id: ObjectId, @Response() res) {
      const result = await this.userActionService.likeAlbum(req.user, _id);

      return res.status(HttpStatusCode.Created).json({
        status_description: result,
      });
  }

  @ApiOperation({ summary: 'Lihat penyuka user' })
  @MapResponseSwagger(UserLikeEntity, {
    status: 200,
    isArray: true,
  })
  @Get('my-fans')
  async viewUserLike(@Request() req, @Query('page') page: number, @Response() res) {
      const data = await this.userActionService.viewUserLike(req.user, page);

      return res.status(HttpStatusCode.Ok).json({data});
  }

  @ApiOperation({ summary: 'Lihat fans rahasia user' })
  @MapResponseSwagger(UserViewEntity, {
    status: 200,
    isArray: true,
  })
  @Get('/my-viewer')
  async viewUserView(@Request() req, @Query('page') page: number, @Response() res) {
      const data = await this.userActionService.viewUserView(req.user, page);

      return res.status(HttpStatusCode.Ok).json({data});
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
    @Query('page') page: number,
    @Response() res
  ) {
      const data = await this.userActionService.viewAlbumLike(req.user, _id, page);

      return res.status(HttpStatusCode.Ok).json({data});
  }
}
