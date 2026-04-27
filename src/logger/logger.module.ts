import { Module } from '@nestjs/common';

import { LoggerConfig } from './logger.config';

@Module({
  imports: [LoggerConfig],
  exports: [LoggerConfig],
})
export class LoggerModule {}
