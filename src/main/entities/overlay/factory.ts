import path from 'node:path';

import { Overlay } from './class';

import { JsonFileService } from '@/main/features/json-files';
import { overlayManifestFileSchema } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/main/shared/types/OverlayManifestFile';
import { OverlayWindowBounds } from '@/main/shared/types/OverlayWindowDimentions';

export class OverlayFactory {
  static createFromFolder(
    uniqueId: string,
    baseUrl: string,
    folderPath: string,
    bounds: Partial<OverlayWindowBounds>,
    visible: boolean,
  ): Overlay | null {
    const data = JsonFileService.read(path.join(folderPath, 'manifest.json'));
    const manifest = overlayManifestFileSchema.parse(data);
    return new Overlay(
      uniqueId,
      baseUrl,
      manifest,
      {
        x: bounds.x || 0,
        y: bounds.y || 0,
        height: bounds.height || manifest.dimentions.defaultHeight,
        width: bounds.width || manifest.dimentions.defaultWidth,
        ...manifest.dimentions,
        ...bounds,
      },
      visible,
    );
  }

  static createFromManifest(
    uniqueId: string,
    baseUrl: string,
    manifest: OverlayManifestFile,
    bounds: OverlayWindowBounds,
    visible: boolean,
  ): Overlay {
    return new Overlay(uniqueId, baseUrl, manifest, bounds, visible);
  }
}
