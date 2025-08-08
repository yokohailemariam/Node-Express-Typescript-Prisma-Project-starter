import { ENV } from '@/config/env';
import { createLogger, transports, format } from 'winston';

const isProduction = ENV.NODE_ENV === 'production';

export const logger = createLogger({
  level: isProduction ? 'info' : 'debug',
  format: isProduction
    ? format.combine(format.timestamp(), format.errors({ stack: true }), format.json())
    : format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.colorize(),
        format.printf(({ timestamp, level, message, stack, ...rest }) => {
          const meta = Object.keys(rest).length ? ` ${JSON.stringify(rest)}` : '';
          return `${timestamp} [${level.toUpperCase()}]: ${stack || message}${meta}`;
        }),
      ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'logs/error.log', level: 'error' }),
    new transports.File({ filename: 'logs/combined.log' }),
  ],
  exitOnError: false,
});
