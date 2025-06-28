import winston from 'winston';
import path from 'path';
import { isDev } from '@/main/shared/utils/is-dev';
import { PathService } from './features/paths/PathService';

// Base transports used by all loggers
const fileTransports: winston.transport[] = [
  new winston.transports.File({
    filename: path.join(PathService.getPath('LOGS'), 'error.log'),
    level: 'error',
  }),
  new winston.transports.File({
    filename: path.join(PathService.getPath('LOGS'), 'combined.log'),
  }),
];

// Console transport to be added in non-production
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
});

export function createServiceLogger(serviceName: string): winston.Logger {
  const transports: winston.transport[] = [...fileTransports];

  if (isDev()) {
    transports.push(consoleTransport);
  }

  return winston.createLogger({
    level: isDev() ? 'debug' : 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    defaultMeta: { service: serviceName },
    transports,
  });
}

export const mainLogger = createServiceLogger('main');
export const overlayServiceLogger = createServiceLogger('overlay-service');
export const windowManagerServiceLogger = createServiceLogger('window-manager-service');
export const jsonFileHandlerServiceLogger = createServiceLogger('json-file-handler-service');
export const userServiceLogger = createServiceLogger('user-service');
export const jsonFileServiceLogger = createServiceLogger('json-file-service');
export const gameWebsocketServerServiceLogger = createServiceLogger(
  'game-websocket-server-service',
);
export const steamLogger = createServiceLogger('steam');
