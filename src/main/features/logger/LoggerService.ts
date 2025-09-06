import path from 'path';

import { app } from 'electron';
import winston from 'winston';

import { IS_DEV } from '@/main/shared/constants';

export class LoggerService {
  private static fileTransports: winston.transport[] = [
    new winston.transports.File({
      filename: path.join(app.getPath('userData'), 'Logs', 'error.log'),
      level: 'error',
    }),
    new winston.transports.File({
      filename: path.join(app.getPath('userData'), 'Logs', 'combined.log'),
    }),
  ];

  private static consoleTransport = new winston.transports.Console({
    format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
  });

  // Cache for created loggers
  private static loggers = new Map<string, winston.Logger>();

  // 🛠️ Ensure transports don’t trigger MaxListenersExceededWarning
  private static initTransports() {
    [...this.fileTransports, this.consoleTransport].forEach(t => {
      if (typeof t.setMaxListeners === 'function') {
        t.setMaxListeners(30); // or 0 to disable warnings
      }
    });
  }

  static getLogger(serviceName: string): winston.Logger {
    if (this.loggers.has(serviceName)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return this.loggers.get(serviceName)!;
    }

    this.initTransports(); // ✅ make sure it’s applied before logger creation

    const transports = [...this.fileTransports];
    if (IS_DEV) {
      transports.push(this.consoleTransport);
    }

    const logger = winston.createLogger({
      level: IS_DEV ? 'debug' : 'info',
      format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
      defaultMeta: { service: serviceName },
      transports,
    });

    this.loggers.set(serviceName, logger);
    return logger;
  }
}
