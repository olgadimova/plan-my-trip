import crypto from 'crypto';
import { IncomingMessage, ServerResponse } from 'http';
import { LoggerModule, Params } from 'nestjs-pino';
import { LevelWithSilent } from 'pino';
import { RequestUserModel } from '../auth/dto';

type IncomingRequest = IncomingMessage & {
  id?: string;
  user?: RequestUserModel;
};

export const loggerConfig: Params = {
  pinoHttp: {
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    customProps: (req: IncomingRequest) => {
      return {
        user: req.user,
      };
    },
    transport:
      process.env.NODE_ENV !== 'production'
        ? { target: 'pino-pretty' }
        : undefined,

    genReqId: (
      req: IncomingRequest & {
        headers: Record<string, string | string[] | undefined>;
      },
    ): string => {
      return req.headers['x-request-id']?.toString() || crypto.randomUUID();
    },

    serializers: {
      req: (req: IncomingRequest) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),

      res: (res: ServerResponse) => ({
        statusCode: res.statusCode,
        err: res.err,
      }),

      user: (user: RequestUserModel) => ({ id: user.sub }),
    },
    customLogLevel: (
      req: IncomingMessage,
      res: ServerResponse,
      err?: Error,
    ): LevelWithSilent => {
      if (res.statusCode >= 500 || err) return 'error';
      if (res.statusCode >= 400) return 'warn';
      return 'info';
    },
  },
};

export const LoggerConfig = LoggerModule.forRoot(loggerConfig);
