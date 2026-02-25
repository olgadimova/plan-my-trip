import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';

import { RoleGuard } from '../shared/guard';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
