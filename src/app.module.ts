import KeyvRedis from '@keyv/redis';
import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { ActivityModule } from './activities/activity.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DestinationModule } from './destinations/destination.module';
import { PrismaDbModule } from './prisma_db/prisma_db.module';
import { QueueModule } from './queues/queue.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: () => ({
        ttl: 30000,
        stores: [
          new KeyvRedis(
            `redis://${process.env.REDIS_HOST ?? 'localhost'}:${process.env.REDIS_PORT ?? '6379'}`,
          ),
        ],
      }),
    }),
    ThrottlerModule.forRoot({
      throttlers: [
        { name: 'short', limit: 10, ttl: 10000 },
        {
          name: 'long',
          ttl: 60000,
          limit: 50,
        },
      ],
    }),
    PrismaDbModule,
    AuthModule,
    DestinationModule,
    ActivityModule,
    UsersModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
