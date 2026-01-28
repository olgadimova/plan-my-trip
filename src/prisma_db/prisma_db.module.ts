import { Global, Module } from '@nestjs/common';

import { PrismaDbService } from './prisma_db.service';

@Global()
@Module({
  providers: [PrismaDbService],
  exports: [PrismaDbService],
})
export class PrismaDbModule {}
