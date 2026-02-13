import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { ActivityModel } from 'generated/nestjs-dto/activity.entity';
import { DestinationModel } from 'generated/nestjs-dto/destination.entity';
import { Prisma } from 'generated/prisma/client';

import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { ActivityResponseModel } from '../shared/dto';
import { CreateActivityDto, UpdateActivityDto } from './dto';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaDbService) {}

  async getActivityById({
    userId,
    activityId,
  }: {
    userId: string;
    activityId: string;
  }): Promise<ActivityResponseModel> {
    const activity: ActivityModel | null =
      await this.prisma.activity.findUnique({
        where: {
          id: activityId,
        },
      });

    if (!activity || activity.userId !== userId)
      throw new NotFoundException('No activity found');

    return plainToInstance(ActivityResponseModel, activity);
  }

  async createActivity({
    userId,
    data,
  }: {
    userId: string;
    data: CreateActivityDto;
  }): Promise<ActivityResponseModel> {
    const destination: DestinationModel | null =
      await this.prisma.destination.findUnique({
        where: {
          id: data.destination_id,
        },
      });

    if (!destination || destination.userId !== userId) {
      throw new NotFoundException('No activity found');
    }

    const activity = this.prisma.activity.create({
      data: {
        userId: userId,
        title: data.title,
        description: data.description,
        destinationId: data.destination_id,
      },
    });

    return plainToInstance(ActivityResponseModel, activity);
  }

  async deleteActivity({
    activityId,
    userId,
  }: {
    activityId: string;
    userId: string;
  }): Promise<void> {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!activity || activity.userId !== userId) {
      throw new NotFoundException('No destination found');
    }

    await this.prisma.activity.delete({
      where: {
        id: activityId,
      },
    });
  }

  async updateActivity({
    activityId,
    userId,
    data,
  }: {
    activityId: string;
    data: UpdateActivityDto;
    userId: string;
  }) {
    const activity = await this.prisma.activity.findUnique({
      where: {
        id: activityId,
      },
    });

    if (!activity || activity.userId !== userId) {
      throw new NotFoundException('No destination found');
    }

    let dto: Prisma.ActivityUpdateInput = {
      title: data.title,
      description: data.description,
    };

    if (data.destination_id !== undefined) {
      const newDestination = await this.prisma.destination.findUnique({
        where: {
          id: data.destination_id,
        },
      });

      if (!newDestination || newDestination.userId !== userId)
        throw new NotFoundException('Please enter a valid destination id');

      dto = {
        ...data,
        destination: {
          connect: { id: data.destination_id },
        },
      };
    }

    const updatedActivity: ActivityModel = await this.prisma.activity.update({
      where: {
        id: activityId,
      },
      data: dto,
    });

    return plainToInstance(ActivityResponseModel, updatedActivity);
  }
}
