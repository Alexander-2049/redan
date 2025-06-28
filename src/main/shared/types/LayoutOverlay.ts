import { z } from 'zod';

import { overlayInLayoutFileSchema } from '../schemas/layout-file-schema';

export type LayoutOverlay = z.infer<typeof overlayInLayoutFileSchema>;
