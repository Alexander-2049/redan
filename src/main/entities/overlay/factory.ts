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
    options: OverlayWindowBounds,
  ): Overlay | null {
    const data = JsonFileService.read(path.join(folderPath, 'manifest.json'));
    const manifest = overlayManifestFileSchema.parse(data);
    return new Overlay(uniqueId, baseUrl, manifest, options);
  }

  static createFromManifest(
    uniqueId: string,
    baseUrl: string,
    manifest: OverlayManifestFile,
    options: OverlayWindowBounds,
  ): Overlay {
    return new Overlay(uniqueId, baseUrl, manifest, options);
  }
}
