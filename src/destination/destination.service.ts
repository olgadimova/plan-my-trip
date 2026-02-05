import { Injectable, NotFoundException } from '@nestjs/common';
import { DestinationModel } from 'generated/nestjs-dto/destination.entity';
import { UserModel } from 'generated/nestjs-dto/user.entity';
import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { CreateDestinationDto, GetAllDestinationsResponseDto } from './dto';

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

    return { destinations };
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

    return destination;
  }

  createDestination({
    userId,
    data,
  }: {
    userId: UserModel['id'];
    data: CreateDestinationDto;
  }): Promise<DestinationModel> {
    return this.prisma.destination.create({
      data: {
        userId,
        title: data.title,
        description: data.description,
        dueDate: data.due_date,
      },
    });
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
}
