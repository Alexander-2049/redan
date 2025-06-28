import fs from 'fs';
import path from 'path';

import express, { Request, Response, Router } from 'express';

import { JsonFileService } from '../json-files';
import { LoggerService } from '../logger/LoggerService';
import { PathService } from '../paths/PathService';

import { overlayManifestFileSchema } from '@/main/shared/schemas/overlay-manifest-file-schema';

type OverlayManifest = {
  folderName: string;
  manifest: ReturnType<typeof overlayManifestFileSchema.parse> | null;
};

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
    this.logger.info('Loading all overlays...');

    const overlaysRoot = PathService.getPath('OVERLAYS');

    if (!fs.existsSync(overlaysRoot)) {
      this.logger.info(`Overlays folder does not exist at: ${overlaysRoot}`);
      fs.mkdirSync(overlaysRoot, { recursive: true });
      this.logger.info(`Created overlays folder at: ${overlaysRoot}`);
    }

    const dir = fs.readdirSync(overlaysRoot);
    const folders = dir.filter(item => fs.statSync(path.join(overlaysRoot, item)).isDirectory());

    this.logger.debug(`Found overlay folders: ${folders.join(', ')}`);

    const overlays: OverlayManifest[] = folders.map(folderName => {
      const folderPath = path.join(overlaysRoot, folderName);
      const manifestPath = path.join(folderPath, 'manifest.json');

      try {
        this.logger.debug(`Reading manifest: ${manifestPath}`);
        const rawManifest: unknown = JsonFileService.read(manifestPath);
        const parsed = overlayManifestFileSchema.safeParse(rawManifest);

        if (parsed.success) {
          this.logger.info(`Successfully parsed manifest in folder: ${folderName}`);
          return {
            folderName,
            manifest: parsed.data,
          };
        } else {
          this.logger.warn(`Invalid manifest schema in folder: ${folderName}`);
          return {
            folderName,
            manifest: null,
          };
        }
      } catch (error) {
        this.logger.error(`Error reading or parsing manifest.json in folder ${folderName}:`, error);
        return {
          folderName,
          manifest: null,
        };
      }
    });

    this.logger.info(`Loaded ${overlays.length} overlays.`);

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
