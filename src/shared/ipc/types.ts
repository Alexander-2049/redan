import { OverlayManifestFile } from '@/main/shared/types/OverlayManifestFile';

export type GetOverlaysResponse = Array<{
  folderName: string;
  manifest: OverlayManifestFile;
}>;

export type SaveOverlayPayload = {
  folderName: string;
  manifest: OverlayManifestFile;
};
