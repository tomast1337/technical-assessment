import { createLogger, format, transports } from 'winston';
import { env } from './config';

const getLevel = (env: string) => {
  switch (env) {
    case 'development':
      return 'debug';
    case 'test':
      return 'error';
    default:
      return 'info';
  }
};

const logger = createLogger({
  level: getLevel(env.NODE_ENV),
  format: format.combine(
    format.colorize(),
    format.timestamp(),
    format.printf(
      ({
        timestamp,
        level,
        message,
        label,
      }: {
        timestamp: string;
        level: string;
        message: string;
        label: string;
      }) => {
        return `[${label}] ${
          timestamp.split('T')[0] + ' ' + timestamp.split('T')[1].split('.')[0]
        } ${level}: ${message}`;
      },
    ),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'combined.log' }),
  ],
});

export default logger;
