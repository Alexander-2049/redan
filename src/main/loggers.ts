import winston from "winston";
import path from "path";
import { LOGS_PATH } from "./main-constants";
import { isDev } from "./utils/is-dev";

// Base transports used by all loggers
const fileTransports: winston.transport[] = [
  new winston.transports.File({
    filename: path.join(LOGS_PATH, "error.log"),
    level: "error",
  }),
  new winston.transports.File({
    filename: path.join(LOGS_PATH, "combined.log"),
  }),
];

// Console transport to be added in non-production
const consoleTransport = new winston.transports.Console({
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  ),
});

/**
 * Creates a Winston logger for a specific service name.
 * Automatically adds file transports.
 * Adds console transport if NODE_ENV !== "production".
 */
export function createServiceLogger(serviceName: string) {
  const transports: winston.transport[] = [...fileTransports];

  if (isDev()) {
    transports.push(consoleTransport);
  }

  return winston.createLogger({
    level: isDev() ? "debug" : "info",
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json(),
    ),
    defaultMeta: { service: serviceName },
    transports,
  });
}

export const mainLogger = createServiceLogger("main");
export const overlayServiceLogger = createServiceLogger("overlay-service");
export const windowManagerServiceLogger = createServiceLogger(
  "window-manager-service",
);
export const jsonFileHandlerServiceLogger = createServiceLogger(
  "json-file-handler-service",
);
export const userServiceLogger = createServiceLogger("user-service");
export const jsonFileServiceLogger = createServiceLogger("json-file-service");
export const gameWebsocketServerServiceLogger = createServiceLogger(
  "game-websocket-server-service",
);
export const steamLogger = createServiceLogger("steam");
