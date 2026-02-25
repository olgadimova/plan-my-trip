import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PrismaDbService } from '../prisma_db/prisma_db.service';
import { GetAllUsersResponseDto, UserResponseModel } from './dto';

@Injectable()
export class UsersService {
  constructor(private prismaDbService: PrismaDbService) {}

  async getAllUsers(): Promise<GetAllUsersResponseDto> {
    const users = await this.prismaDbService.user.findMany({
      select: {
        email: true,
        createdAt: true,
        name: true,
      },
    });

    return {
      users: plainToInstance(UserResponseModel, users),
    };
  }
}
