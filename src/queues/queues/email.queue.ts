import { RegisterQueueOptions } from '@nestjs/bullmq';

export const EMAIL_QUEUE_NAME: string = 'email-queue';

export const emailQueue: RegisterQueueOptions = {
  name: EMAIL_QUEUE_NAME,
};
