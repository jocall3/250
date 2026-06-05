import winston from 'winston';
import { jsonLogFormatter } from '../../utils/logging/json.log.formatter';

const getLogLevel = (): string => {
  const env = process.env.NODE_ENV || 'development';
  if (env === 'production') return 'info';
  if (env === 'test') return 'error';
  return 'debug';
};

class LoggerCore {
  private static instance: winston.Logger;

  public static getInstance(): winston.Logger {
    if (!LoggerCore.instance) {
      LoggerCore.instance = winston.createLogger({
        level: getLogLevel(),
        format: winston.format.combine(
          jsonLogFormatter(),
          winston.format.json()
        ),
        transports: [
          new winston.transports.Console({
            silent: process.env.NODE_ENV === 'test',
          }),
        ],
        exitOnError: false,
      });
    }
    return LoggerCore.instance;
  }
}

export const logger = LoggerCore.getInstance();