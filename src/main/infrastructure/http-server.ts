import http from 'http';
import { Socket } from 'net';

import cors from 'cors';
import express from 'express';

import { LoggerService } from '../features/logger/LoggerService';

type RouteWithPath = {
  path: string;
  router: express.Router;
};

export class HttpServer {
  public app: express.Application;
  public server: http.Server;
  private port: number;
  private logger = LoggerService.getLogger('http-server');

  private connections = new Set<Socket>();

  constructor(port = 3000, routes: RouteWithPath[] = []) {
    this.app = express();
    this.port = port;
    this.app.use(cors());

    // Mount all routes
    for (const route of routes) {
      this.app.use(route.path, route.router);
      this.logger.info(`Mounted router on path: ${route.path}`);
    }

    // Optional: 404 handler for unmatched routes
    this.app.use((req, res): void => {
      res.status(404).send('Route not found');
    });

    this.server = http.createServer(this.app);

    this.server.on('connection', socket => {
      this.connections.add(socket);

      socket.on('close', () => {
        this.connections.delete(socket);
      });
    });
  }

  public start(): void {
    this.server.listen(this.port, (): void => {
      this.logger.info(`HTTP server is running on http://localhost:${this.port}`);
    });
  }

  public stop(): Promise<void> {
    let resolved = false;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (!resolved) {
          this.logger.warn("HTTP server didn't stop for 3 seconds. Forcing close...");

          for (const socket of this.connections) {
            socket.destroy();
          }

          resolved = true;
          resolve();
        }
      }, 3000);

      if (!this.server.listening) {
        clearTimeout(timeout);
        resolved = true;
        resolve();
        return;
      }

      this.logger.info('Stopping HTTP server...');

      this.server.close(err => {
        clearTimeout(timeout);

        if (err) {
          reject(err);
          return;
        }

        this.logger.info('HTTP server stopped');
        resolved = true;
        resolve();
      });
    });
  }
}
