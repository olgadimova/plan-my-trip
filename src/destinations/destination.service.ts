import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DestinationModel } from 'generated/nestjs-dto/destination.entity';
import { UserModel } from 'generated/nestjs-dto/user.entity';

import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { ActivityResponseModel } from '../shared/dto';
import { CacheKeys } from '../shared/utilities/cache_keys';
import {
  ActivitiesResponseDto,
  CreateDestinationDto,
  DestinationResultModel,
  GetAllDestinationsResponseDto,
} from './dto';

@Injectable()
export class DestinationService {
  constructor(
    private prisma: PrismaDbService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async getAllDestinations(
    userId: UserModel['id'],
  ): Promise<GetAllDestinationsResponseDto> {
    const cacheKey: string = CacheKeys.destinations(userId);

    const destinationsCache =
      await this.cacheManager.get<DestinationResultModel[]>(cacheKey);

    if (destinationsCache) {
      return { destinations: destinationsCache };
    }

    const destinations = await this.prisma.destination.findMany({
      where: {
        userId,
      },
    });

    const userDestinations: DestinationResultModel[] = plainToInstance(
      DestinationResultModel,
      destinations,
    );

    await this.cacheManager.set(cacheKey, userDestinations);

    return {
      destinations: userDestinations,
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
    const cacheKey: string = CacheKeys.activities(destinationId, userId);

    const activitiesCache =
      await this.cacheManager.get<ActivityResponseModel[]>(cacheKey);

    if (activitiesCache) {
      return { activities: activitiesCache };
    }

    const activities = await this.prisma.activity.findMany({
      where: {
        destinationId,
        userId,
      },
    });

    const userActivities: ActivityResponseModel[] = plainToInstance(
      ActivityResponseModel,
      activities,
    );
    await this.cacheManager.set(cacheKey, userActivities);

    return { activities: userActivities };
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

    const cacheKey: string = CacheKeys.destinations(userId);
    await this.cacheManager.del(cacheKey);

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

    const cacheKeyDestination: string = CacheKeys.destinations(userId);
    const cacheKeyActivities: string = CacheKeys.activities(id, userId);

    await this.cacheManager.mdel([cacheKeyActivities, cacheKeyDestination]);
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

    const cacheKey: string = CacheKeys.destinations(userId);
    await this.cacheManager.del(cacheKey);

    return plainToInstance(DestinationResultModel, updatedDestination);
  }
}
