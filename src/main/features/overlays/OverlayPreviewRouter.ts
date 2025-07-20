import fs from 'fs';
import path from 'path';

import express, { Request, Response, Router } from 'express';

import { LoggerService } from '../logger/LoggerService';

export class OverlayPreviewRouter {
  private static instance: OverlayPreviewRouter;
  private logger = LoggerService.getLogger('preview-server');
  public readonly router: Router;

  private activeFolder: string | null = null;

  private constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  public static getInstance(): OverlayPreviewRouter {
    if (!OverlayPreviewRouter.instance) {
      OverlayPreviewRouter.instance = new OverlayPreviewRouter();
    }
    return OverlayPreviewRouter.instance;
  }

  public startServing(folderPath: string): void {
    if (!fs.existsSync(folderPath) || !fs.statSync(folderPath).isDirectory()) {
      throw new Error(`Invalid preview folder: ${folderPath}`);
    }

    this.logger.info(`Preview server started for folder: ${folderPath}`);
    this.activeFolder = path.resolve(folderPath);
  }

  public stopServing(): void {
    this.logger.info(`Preview server stopped`);
    this.activeFolder = null;
  }

  public isRunning(): boolean {
    return !!this.activeFolder;
  }

  private setupRoutes(): void {
    // Redirect /preview → /preview/index.html
    this.router.get('', (req: Request, res: Response) => {
      if (!this.activeFolder) {
        return res.status(503).send('Preview server is not running.');
      }

      const indexPath = path.join(this.activeFolder, 'index.html');
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        return res.redirect(301, req.baseUrl + '/index.html');
      } else {
        return res.status(404).send('index.html not found.');
      }
    });

    // Disable caching
    this.router.use((req, res, next) => {
      res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      res.setHeader('Surrogate-Control', 'no-store');
      next();
    });

    // Serve index.html at /preview/
    this.router.get('/', (req: Request, res: Response) => {
      if (!this.activeFolder) {
        return res.status(503).send('Preview server is not running.');
      }

      const indexPath = path.join(this.activeFolder, 'index.html');
      if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
        return res.sendFile(indexPath);
      } else {
        return res.status(404).send('index.html not found.');
      }
    });

    // Serve /preview/* files
    this.router.get('/*', (req: Request, res: Response) => {
      if (!this.activeFolder) {
        return res.status(503).send('Preview server is not running.');
      }

      const decodedPath = decodeURIComponent(req.path);
      const requestedPath = path.normalize(path.join(this.activeFolder, decodedPath));

      if (!requestedPath.startsWith(this.activeFolder)) {
        return res.status(403).send('Access denied.');
      }

      if (fs.existsSync(requestedPath) && fs.statSync(requestedPath).isFile()) {
        return res.sendFile(requestedPath);
      }

      const fallbackIndex = path.join(requestedPath, 'index.html');
      if (fs.existsSync(fallbackIndex) && fs.statSync(fallbackIndex).isFile()) {
        return res.sendFile(fallbackIndex);
      }

      return res.status(404).send('Not found.');
    });
  }
}
