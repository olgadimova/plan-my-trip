export interface EmailJobData {
  to: string;
  subject: string;
  data?: Record<string, any>;
  scheduledDate?: Date;
}

export const EmailJobName: Record<string, string> = {
  SEND_EMAIL: 'send-email',
};
