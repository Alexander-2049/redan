import { OverlayManifestFile } from './OverlayManifestFile';

export interface OverlayExtended {
  folderName: string;
  manifest: OverlayManifestFile | null;
}
