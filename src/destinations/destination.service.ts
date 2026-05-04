import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { DestinationModel } from 'generated/nestjs-dto/destination.entity';
import { UserModel } from 'generated/nestjs-dto/user.entity';
import { DestinationWhereInput } from 'generated/prisma/models/Destination';

import { PrismaDbService } from '../prisma_db/prisma_db.service';
import {
  ActivityResponseModel,
  MetaResultModel,
  PaginationDto,
} from '../shared/dto';
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
    { page, per_page: perPage }: PaginationDto,
  ): Promise<GetAllDestinationsResponseDto> {
    const versionKey: string = CacheKeys.destinations(userId);

    let version: number | undefined =
      await this.cacheManager.get<number>(versionKey);

    if (!version) {
      version = 1;
      await this.cacheManager.set(versionKey, version);
    }

    const cacheKey: string = CacheKeys.destinationsByVersion({
      userId,
      page,
      perPage,
      version,
    });

    const destinationsCache =
      await this.cacheManager.get<GetAllDestinationsResponseDto>(cacheKey);

    if (destinationsCache) {
      return {
        destinations: plainToInstance(
          DestinationResultModel,
          destinationsCache.destinations,
        ),
        meta: destinationsCache.meta,
      };
    }

    const skip: number = (page - 1) * perPage;
    const where: DestinationWhereInput = { userId };

    const [destinations, total] = await this.prisma.$transaction([
      this.prisma.destination.findMany({
        skip,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        where,
      }),
      this.prisma.destination.count({ where }),
    ]);

    const userDestinations: DestinationResultModel[] = plainToInstance(
      DestinationResultModel,
      destinations,
    );

    const meta: MetaResultModel = {
      total,
      page,
      per_page: perPage,
      last_page: Math.ceil(total / perPage),
    };

    await this.cacheManager.set(cacheKey, {
      destinations: userDestinations,
      meta,
    });

    return {
      destinations: userDestinations,
      meta,
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
      return {
        activities: plainToInstance(ActivityResponseModel, activitiesCache),
      };
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

  async clearDestinationsCache(userId: string): Promise<void> {
    const versionKey: string = CacheKeys.destinations(userId);
    const version: number | undefined =
      await this.cacheManager.get<number>(versionKey);
    await this.cacheManager.set(versionKey, (version || 1) + 1);
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

    await this.clearDestinationsCache(userId);
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

    await this.clearDestinationsCache(userId);

    const cacheKeyActivities: string = CacheKeys.activities(id, userId);
    await this.cacheManager.del(cacheKeyActivities);
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

    await this.clearDestinationsCache(userId);

    return plainToInstance(DestinationResultModel, updatedDestination);
  }
}
