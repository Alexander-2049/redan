import { z } from 'zod';

import { overlayManifestFileSchema } from '@/main/_/overlay-service/schemas';

export interface OverlayAndFolderName {
  folderName: string;
  data: z.infer<typeof overlayManifestFileSchema>;
}
