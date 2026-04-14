import { BullModule } from '@nestjs/bullmq';
import { Global, Module } from '@nestjs/common';

import { EmailService } from './email.service';
import { EmailProcessor } from './processors/email.processor';
import { emailQueue } from './queues/email.queue';

@Global()
@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        lazyConnect: true,
      },
    }),
    BullModule.registerQueue(emailQueue),
  ],
  providers: [EmailProcessor, EmailService],
  exports: [BullModule, EmailService],
})
export class QueueModule {}
