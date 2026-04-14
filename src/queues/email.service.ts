import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';

import { EmailJobData, EmailJobName } from './interfaces/queue.interface';
import { EMAIL_QUEUE_NAME } from './queues/email.queue';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  constructor(
    @InjectQueue(EMAIL_QUEUE_NAME)
    private readonly emailQueue: Queue,
  ) {}

  async sendEmail(data: EmailJobData): Promise<void> {
    try {
      await this.emailQueue.add(EmailJobName.SEND_EMAIL, data, {
        priority: 1,
        delay: 0,
      });
    } catch (error) {
      this.logger.error(
        'Failed to add email to queue - Redis connection issue',
        error,
      );
      throw new Error(
        'Unable to process email request due to queue system failure',
      );
    }
  }

  async scheduleEmail(data: EmailJobData): Promise<void> {
    if (!data.scheduledDate) {
      throw new Error('Scheduled date must be provided');
    }

    const delay: number = data.scheduledDate.getTime() - Date.now();

    if (delay <= 0) {
      throw new Error('Scheduled date must be in the future');
    }

    try {
      await this.emailQueue.add(EmailJobName.SEND_EMAIL, data, {
        priority: 1,
        delay: delay,
      });
    } catch (error) {
      this.logger.error(
        'Failed to add scheduled email to queue - Redis connection issue',
        error,
      );
      throw new Error('Unable to schedule email due to queue system failure');
    }
  }
}
