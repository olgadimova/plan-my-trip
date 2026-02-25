import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseInterceptors,
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

import { Role } from 'generated/prisma/enums';
import { Roles } from '../shared/decorator';
import { GetAllUsersResponseDto } from './dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    type: GetAllUsersResponseDto,
  })
  @Roles(Role.ADMIN)
  @Get('all')
  getAllUsers(): Promise<GetAllUsersResponseDto> {
    return this.usersService.getAllUsers();
  }
}
