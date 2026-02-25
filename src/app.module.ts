import { AppService } from './app.service';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ActivityModule } from './activities/activity.module';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { DestinationModule } from './destinations/destination.module';
import { PrismaDbModule } from './prisma_db/prisma_db.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    PrismaDbModule,
    AuthModule,
    DestinationModule,
    ActivityModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
