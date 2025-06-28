import express from 'express';
import path from 'path';
import { LoggerService } from '../logger/LoggerService';

export class AssetsRouter {
  public router: express.Router;
  protected logger = LoggerService.getLogger('assets-router');

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    const publicDir = path.resolve(__dirname, '../public');
    this.logger.info(`Serving static files from: ${publicDir}`);

    // Serve static files under /assets
    this.router.use(express.static(publicDir));

    // Fallback for not found files in assets
    this.router.get('*', (req, res): void => {
      res.status(404).send('File not found');
    });
  }
}
