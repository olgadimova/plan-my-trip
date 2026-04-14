import { OnWorkerEvent, Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

import { EmailJobData, EmailJobName } from '../interfaces/queue.interface';
import { EMAIL_QUEUE_NAME } from '../queues/email.queue';

@Processor(EMAIL_QUEUE_NAME, { concurrency: 3 })
export class EmailProcessor extends WorkerHost {
  private readonly logger = new Logger(EmailProcessor.name);

  async process(job: Job<EmailJobData>) {
    const { to, subject, data } = job.data;

    switch (job.name) {
      case EmailJobName.SEND_EMAIL:
        await this.simulateEmailSending(to, subject);
        break;
      default:
        throw new Error(`Unknown job name ${job.name}`);
    }
  }

  @OnWorkerEvent('active')
  onActive(job: Job<EmailJobData>) {
    this.logger.log(
      `Processing ${job.name} job ${job.id} - Sending email to ${job.data.to}`,
    );
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<EmailJobData>) {
    this.logger.log(`${job.name} job ${job.id} completed successfully`);
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<EmailJobData>, error: Error) {
    this.logger.error(`${job.name} job ${job.id} failed:`, error);
  }

  private async simulateEmailSending(
    to: string,
    subject: string,
  ): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    this.logger.log(`Email sent to ${to} with subject: ${subject}`);
  }
}
