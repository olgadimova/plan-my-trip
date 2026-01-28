import { AppService } from './app.service';

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { PrismaDbModule } from './prisma_db/prisma_db.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrismaDbModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
