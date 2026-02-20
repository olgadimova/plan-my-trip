import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from 'generated/prisma/client';

@Injectable()
export class PrismaDbService extends PrismaClient {
  constructor(config: ConfigService) {
    super({
      adapter: new PrismaPg({
        connectionString: config.get<string>('DATABASE_URL'),
      }),
    });
  }

  public cleanDb() {
    return this.$transaction([
      this.destination.deleteMany(),
      this.activity.deleteMany(),
      this.user.deleteMany(),
    ]);
  }
}
