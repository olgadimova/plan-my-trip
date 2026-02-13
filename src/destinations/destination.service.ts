import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { DestinationModel } from 'generated/nestjs-dto/destination.entity';
import { UserModel } from 'generated/nestjs-dto/user.entity';

import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { ActivityResponseModel } from '../shared/dto';
import {
  ActivitiesResponseDto,
  CreateDestinationDto,
  DestinationResultModel,
  GetAllDestinationsResponseDto,
} from './dto';

@Injectable()
export class DestinationService {
  constructor(private prisma: PrismaDbService) {}

  async getAllDestinations(
    userId: UserModel['id'],
  ): Promise<GetAllDestinationsResponseDto> {
    const destinations = await this.prisma.destination.findMany({
      where: {
        userId,
      },
    });

    return {
      destinations: plainToInstance(DestinationResultModel, destinations),
    };
  }

  async getDestination({
    userId,
    id,
  }: {
    userId: UserModel['id'];
    id: DestinationModel['userId'];
  }): Promise<DestinationModel> {
    const destination: DestinationModel | null =
      await this.prisma.destination.findUnique({
        where: {
          id,
        },
      });

    if (!destination || destination.userId !== userId)
      throw new NotFoundException('No destination found');

    return plainToInstance(DestinationResultModel, destination);
  }

  async getDestinationActivities({
    destinationId,
    userId,
  }: {
    destinationId: string;
    userId: string;
  }): Promise<ActivitiesResponseDto> {
    const activities = await this.prisma.activity.findMany({
      where: {
        destinationId,
        userId,
      },
    });

    return { activities: plainToInstance(ActivityResponseModel, activities) };
  }

  async createDestination({
    userId,
    data,
  }: {
    userId: UserModel['id'];
    data: CreateDestinationDto;
  }): Promise<DestinationModel> {
    const destination: DestinationModel = await this.prisma.destination.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        dueDate: data.due_date,
      },
    });

    return plainToInstance(DestinationResultModel, destination);
  }

  async deleteDestination({
    userId,
    id,
  }: {
    userId: UserModel['id'];
    id: DestinationModel['userId'];
  }): Promise<void> {
    const destination = await this.prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!destination || destination.userId !== userId)
      throw new NotFoundException('No destination found');

    await this.prisma.destination.delete({
      where: {
        id,
      },
    });
  }

  async editDestination({
    userId,
    id,
    data,
  }: {
    userId: UserModel['id'];
    id: DestinationModel['userId'];
    data: CreateDestinationDto;
  }): Promise<DestinationResultModel> {
    const destination = await this.prisma.destination.findUnique({
      where: {
        id,
      },
    });

    if (!destination || destination.userId !== userId)
      throw new NotFoundException('No destination found');

    const updatedDestination: DestinationModel =
      await this.prisma.destination.update({
        where: {
          id,
        },
        data: {
          title: data.title,
          description: data.description,
          dueDate: data.due_date,
        },
      });

    return plainToInstance(DestinationResultModel, updatedDestination);
  }
}
