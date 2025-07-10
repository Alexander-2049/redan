import path from 'path';

import { OverlayFactory } from '../overlay/factory';

import { Layout } from './class';

import { JsonFileService } from '@/main/features/json-files';
import { LoggerService } from '@/main/features/logger/LoggerService';
import { PathService } from '@/main/features/paths/PathService';
import { layoutFileSchema } from '@/main/shared/schemas/layout-file-schema';
import { OverlayWindowBounds } from '@/main/shared/types/OverlayWindowDimentions';
import { HTTP_SERVER_PORT } from '@/shared/constants';
import { LayoutFile } from '@/shared/types/LayoutFile';

const logger = LoggerService.getLogger('layout-factory');

export class LayoutFactory {
  static createFromFile(filename: string): Layout | null {
    const filePath = path.join(JsonFileService.path.join(PathService.getPath('LAYOUTS')), filename);
    logger.info(`Loading layout from file: ${filePath}`);

    let parsed: LayoutFile;
    try {
      const rawData = JsonFileService.read(filePath);
      parsed = layoutFileSchema.parse(rawData);
      logger.debug(`Successfully parsed layout file: ${filename}`);
    } catch (err) {
      logger.error(`Failed to parse layout file "${filename}":`, err);
      return null;
    }

    const layout = new Layout({
      filename,
      game: parsed.game,
      screen: parsed.screen,
    });

    for (const overlayConfig of parsed.overlays) {
      const bounds: OverlayWindowBounds = {
        position: overlayConfig.position,
        size: {
          ...overlayConfig.size,
          minWidth: overlayConfig.size.width,
          minHeight: overlayConfig.size.height,
          maxWidth: overlayConfig.size.width,
          maxHeight: overlayConfig.size.height,
        },
      };

      const overlay = OverlayFactory.createFromFolder(
        overlayConfig.id,
        `http://localhost:${HTTP_SERVER_PORT}/${overlayConfig.folderName}`,
        path.join(PathService.getPath('OVERLAYS'), overlayConfig.folderName),
        bounds,
        overlayConfig.visible,
      );

      if (!overlay) {
        logger.warn(
          `Failed to create overlay: ${overlayConfig.id} from folder "${overlayConfig.folderName}"`,
        );
        continue;
      }

      overlay.updateSettings(overlayConfig.settings);
      overlayConfig.visible ? overlay.show() : overlay.hide();
      layout.addOverlay(overlay, overlayConfig.folderName);
      logger.debug(`Added overlay: ${overlayConfig.id} to layout.`);
    }

    logger.info(`Layout "${filename}" loaded successfully.`);
    return layout;
  }

  static createAndSaveNewLayout(filename: string, layoutData: LayoutFile): Layout | null {
    const layoutsPath = PathService.getPath('LAYOUTS');
    const filePath = path.join(layoutsPath, filename);
    logger.info(`Creating and saving new layout: ${filename}`);

    if (JsonFileService.exists(filePath)) {
      logger.warn(`Layout file already exists: ${filePath}`);
      return null;
    }

    let parsed: LayoutFile;
    try {
      parsed = layoutFileSchema.parse(layoutData);
      logger.debug(`Layout data validated successfully for: ${filename}`);
    } catch (err) {
      logger.error(`Failed to validate layout data for "${filename}":`, err);
      return null;
    }

    try {
      JsonFileService.write(filePath, parsed);
      logger.info(`Layout file written successfully: ${filePath}`);
    } catch (err) {
      logger.error(`Failed to write layout file "${filename}":`, err);
      return null;
    }

    return this.createFromFile(filename);
  }
}
