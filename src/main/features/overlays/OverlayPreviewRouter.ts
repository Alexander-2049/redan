import fs from 'fs';
import path from 'path';

import express, { Request, Response, Router } from 'express';

import { LoggerService } from '../logger/LoggerService';

import { HTTP_SERVER_PORT } from '@/shared/constants';
import { overlayManifestFileSchema } from '@/shared/schemas/overlayManifestFileSchema';

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
        const queryString =
          new URLSearchParams(req.query as Record<string, string>).toString() + '&' + 'preview';
        const redirectUrl = queryString
          ? `${req.baseUrl}/index.html?${queryString}`
          : `${req.baseUrl}/index.html`;
        return res.redirect(301, redirectUrl);
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

    this.router.get('/thumbnail', (req: Request, res: Response) => {
      if (!this.activeFolder) {
        return res.status(404).send('Overlay is not selected.');
      }

      // Determine root overlay folder
      const requestedPath = path.join(this.activeFolder);
      const overlayRoot = fs.statSync(requestedPath).isDirectory()
        ? requestedPath
        : path.dirname(requestedPath);

      const manifestPath = path.join(overlayRoot, 'manifest.json');

      if (!fs.existsSync(manifestPath)) {
        return res.status(404).send('Required files not found.');
      }

      let manifestRaw: string;
      try {
        manifestRaw = fs.readFileSync(manifestPath, 'utf-8');
      } catch (err) {
        return res.status(404).send('Could not read manifest.json.');
      }

      let manifestData;
      try {
        const parsed = JSON.parse(manifestRaw) as unknown;
        manifestData = overlayManifestFileSchema.parse(parsed);
      } catch (err) {
        return res.status(404).send('Invalid manifest.json structure.');
      }

      const { defaultWidth, defaultHeight } = manifestData.dimentions;

      const containerSize = 270;
      const widthRatio = containerSize / defaultWidth;
      const heightRatio = containerSize / defaultHeight;
      const scale = Math.min(widthRatio, heightRatio); // Scale to cover

      const iframeSrc = `http://localhost:${HTTP_SERVER_PORT}/preview?preview`; // remove query params from src
      const html = `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Overlay Screenshot</title>
      <style>
        html, body {
          margin: 0;
          padding: 0;
          width: 300px;
          height: 300px;
          overflow: hidden;
        }
        .frame-container {
          width: 100%;
          height: 100%;
          box-sizing: border-box;
          background-image: url("http://localhost:${HTTP_SERVER_PORT}/assets/images/738c2f57-adad-4978-898c-0ac778680d9b.jpg");
          background-position: center;
          background-size: auto;
          box-shadow: 0 0 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        iframe {
          width: ${defaultWidth}px;
          height: ${defaultHeight}px;
          transform: scale(${scale});
          transform-origin: center;
          border: none;
          pointer-events: none;
          flex-shrink: 0;
        }
      </style>
    </head>
    <body>
      <div class="frame-container">
        <iframe src="${iframeSrc}"></iframe>
      </div>
    </body>
  </html>
`;
      return res.send(html);
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
