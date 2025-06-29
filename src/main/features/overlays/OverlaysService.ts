import fs from 'fs';
import path from 'path';

import { JsonFileService } from '../json-files';
import { LoggerService } from '../logger/LoggerService';
import { PathService } from '../paths/PathService';

import { overlayManifestFileSchema } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/main/shared/types/OverlayManifestFile';

const logger = LoggerService.getLogger('overlay-service');

export class OverlaysService {
  public static loadAllOverlays(): { folderName: string; manifest: OverlayManifestFile | null }[] {
    logger.info('Loading all overlays...');

    const overlaysRoot = PathService.getPath('OVERLAYS');

    if (!fs.existsSync(overlaysRoot)) {
      logger.info(`Overlays folder does not exist at: ${overlaysRoot}`);
      fs.mkdirSync(overlaysRoot, { recursive: true });
      logger.info(`Created overlays folder at: ${overlaysRoot}`);
    }

    const dir = fs.readdirSync(overlaysRoot);
    const folders = dir.filter(item => fs.statSync(path.join(overlaysRoot, item)).isDirectory());

    logger.debug(`Found overlay folders: ${folders.join(', ')}`);

    const overlays = folders.map(folderName => {
      const folderPath = path.join(overlaysRoot, folderName);
      const manifestPath = path.join(folderPath, 'manifest.json');

      try {
        logger.debug(`Reading manifest: ${manifestPath}`);
        const rawManifest = JsonFileService.read(manifestPath);
        const parsed = overlayManifestFileSchema.safeParse(rawManifest);

        if (parsed.success) {
          logger.info(`Successfully parsed manifest in folder: ${folderName}`);
          return {
            folderName,
            manifest: parsed.data,
          };
        } else {
          logger.warn(`Invalid manifest schema in folder: ${folderName}`);
          return {
            folderName,
            manifest: null,
          };
        }
      } catch (error) {
        logger.error(`Error reading or parsing manifest.json in folder ${folderName}:`, error);
        return {
          folderName,
          manifest: null,
        };
      }
    });

    logger.info(`Loaded ${overlays.length} overlays.`);
    return overlays;
  }

  public static loadOverlayManifest(folderName: string): OverlayManifestFile | null {
    const folderPath = path.join(PathService.getPath('OVERLAYS'), folderName);
    const manifestPath = path.join(folderPath, 'manifest.json');

    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      logger.debug(`Attempting to load manifest from: ${manifestPath}`);
      try {
        const manifest = JsonFileService.read(manifestPath);
        const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

        if (parsedManifest.success) {
          logger.info(`Successfully loaded manifest for overlay: ${folderName}`);
          return parsedManifest.data;
        } else {
          logger.warn(`Manifest schema validation failed for: ${folderName}`);
        }
      } catch (error) {
        logger.error(`[2] Error reading or parsing manifest.json in folder ${folderName}:`, error);
      }
    } else {
      logger.warn(`Overlay folder does not exist or is not a directory: ${folderPath}`);
    }

    return null;
  }
}
