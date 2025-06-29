import { z } from 'zod';

import { overlaySettingInLayoutFileSchema } from '../schemas/layout-file-schema';

export type OverlaySettingInLayout = z.infer<typeof overlaySettingInLayoutFileSchema>;
