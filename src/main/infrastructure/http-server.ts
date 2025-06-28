import http from 'http';

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
  }

  public start(): void {
    this.server.listen(this.port, (): void => {
      this.logger.info(`HTTP server is running on http://localhost:${this.port}`);
    });
  }
}
