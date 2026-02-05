import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { DestinationModel } from 'generated/nestjs-dto/destination.entity';

import { GetUser } from '../auth/decorator';
import { DestinationService } from './destination.service';
import { CreateDestinationDto, GetAllDestinationsResponseDto } from './dto';

@ApiTags('Destinations')
@Controller('destination')
export class DestinationController {
  constructor(private destinationService: DestinationService) {}

  @ApiResponse({
    type: GetAllDestinationsResponseDto,
  })
  @Get('all')
  getAllDestinations(
    @GetUser() user: { sub: string; email: string },
  ): Promise<GetAllDestinationsResponseDto> {
    return this.destinationService.getAllDestinations(user.sub);
  }

  @ApiResponse({
    type: DestinationModel,
  })
  @Get(':id')
  getDestination(
    @GetUser() user: { sub: string; email: string },
    @Param('id') id: string,
  ): Promise<DestinationModel> {
    return this.destinationService.getDestination({ userId: user.sub, id });
  }

  @ApiResponse({
    type: DestinationModel,
  })
  @Post('')
  createDestination(
    @GetUser() user: { sub: string; email: string },
    @Body() data: CreateDestinationDto,
  ): Promise<DestinationModel> {
    return this.destinationService.createDestination({
      userId: user.sub,
      data,
    });
  }

  @Delete(':id')
  deleteDestination(
    @GetUser() user: { sub: string; email: string },
    @Param('id') id: string,
  ): Promise<void> {
    return this.destinationService.deleteDestination({
      userId: user.sub,
      id,
    });
  }
}
