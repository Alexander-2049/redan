import fs from 'fs';
import path from 'path';

import express, { Request, Response, Router } from 'express';

import { LoggerService } from '../logger/LoggerService';
import { PathService } from '../paths/PathService';

class OverlayService {
  static loadAllOverlays(): unknown[] {
    return [{ name: 'example', path: '/example' }];
  }
}

export class OverlaysRouter {
  public readonly router: Router;
  private readonly logger = LoggerService.getLogger('overlays-router');

  constructor() {
    this.router = express.Router();
    this.setupRoutes();
  }

  private setupRoutes(): void {
    this.router.get('/', this.getOverlayList);
    this.router.get('/*', this.serveOverlayFile.bind(this));
  }

  private getOverlayList = (req: Request, res: Response): Response => {
    const overlays = OverlayService.loadAllOverlays();
    return res.json(overlays);
  };

  private serveOverlayFile(req: Request, res: Response): void {
    try {
      const decodedPath: string = decodeURIComponent(req.path);
      const requestedPath: string = path.normalize(
        path.join(PathService.getPath('OVERLAYS'), decodedPath),
      );

      if (!requestedPath.startsWith(PathService.getPath('OVERLAYS'))) {
        res.status(403).send('Access denied.');
        return;
      }

      const filePath: string = requestedPath;

      if (!path.extname(decodedPath)) {
        const indexPath: string = path.join(filePath, 'index.html');
        if (fs.existsSync(indexPath) && fs.statSync(indexPath).isFile()) {
          const queryParams = new URLSearchParams(req.query as Record<string, string>).toString();

          const redirectUrl: string =
            path.join(decodedPath, 'index.html') + (queryParams ? `?${queryParams}` : '');

          return res.redirect(301, redirectUrl);
        } else {
          res.status(404).send('Not found.');
          return;
        }
      }

      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return res.sendFile(filePath);
      } else {
        res.status(404).send('Not found.');
        return;
      }
    } catch (error) {
      this.logger.error(error);
      res.status(500).send('Internal Server Error.');
      return;
    }
  }
}
