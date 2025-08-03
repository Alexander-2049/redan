import { OverlayManifestFile } from './OverlayManifestFile';
import { WorkshopItem } from './steam';

export interface OverlayExtended {
  folderName: string;
  workshop?: WorkshopItem;
  manifest: OverlayManifestFile | null;
}
