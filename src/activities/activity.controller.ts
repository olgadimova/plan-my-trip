import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { GetUser } from '../auth/decorator';
import { RequestUserModel } from '../auth/dto';
import { ActivityResponseModel } from '../shared/dto';
import { ActivityService } from './activity.service';
import { CreateActivityDto, UpdateActivityDto } from './dto';

@ApiTags('Activities')
@Controller('activities')
@UseInterceptors(ClassSerializerInterceptor)
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @ApiResponse({
    type: ActivityResponseModel,
  })
  @Get(':id')
  getActivityById(
    @Param('id') activityId: string,
    @GetUser() user: RequestUserModel,
  ) {
    return this.activityService.getActivityById({
      activityId,
      userId: user.sub,
    });
  }

  @ApiResponse({
    type: ActivityResponseModel,
  })
  @Post('')
  createActivity(
    @GetUser() user: RequestUserModel,
    @Body() data: CreateActivityDto,
  ) {
    return this.activityService.createActivity({ userId: user.sub, data });
  }

  @ApiResponse({
    type: ActivityResponseModel,
  })
  @Patch(':id')
  updateActivity(
    @Param('id') activityId: string,
    @Body() data: UpdateActivityDto,
    @GetUser() user: RequestUserModel,
  ) {
    return this.activityService.updateActivity({
      activityId,
      data,
      userId: user.sub,
    });
  }

  @Delete(':id')
  deleteActivity(
    @Param('id') activityId: string,
    @GetUser() user: RequestUserModel,
  ) {
    return this.activityService.deleteActivity({
      activityId,
      userId: user.sub,
    });
  }
}
