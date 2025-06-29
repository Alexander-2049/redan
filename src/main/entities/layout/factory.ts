import path from 'path';

import { OverlayFactory } from '../overlay/factory';

import { Layout } from './class';

import { JsonFileService } from '@/main/features/json-files';
import { PathService } from '@/main/features/paths/PathService';
import { HTTP_SERVER_PORT } from '@/main/shared/constants';
import { layoutFileSchema } from '@/main/shared/schemas/layout-file-schema';
import { OverlayWindowBounds } from '@/main/shared/types/OverlayWindowDimentions';

export class LayoutFactory {
  static createFromFile(filename: string): Layout {
    const filePath = path.join(JsonFileService.path.join(PathService.getPath('LAYOUTS')), filename);

    const parsed = layoutFileSchema.parse(JsonFileService.read(filePath));

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
        `${path.join(PathService.getPath('OVERLAYS'), overlayConfig.folderName)}`,
        bounds,
        overlayConfig.visible,
      );

      if (!overlay) continue;

      overlay.updateSettings(overlayConfig.settings);
      overlayConfig.visible ? overlay.show() : overlay.hide();

      layout.addOverlay(overlay, overlayConfig.folderName);
    }

    return layout;
  }
}
