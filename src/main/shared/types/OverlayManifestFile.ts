import { z } from 'zod';

import { overlayManifestFileSchema } from '../schemas/overlay-manifest-file-schema';

export type OverlayManifestFile = z.infer<typeof overlayManifestFileSchema>;
