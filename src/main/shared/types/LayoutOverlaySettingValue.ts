import { z } from 'zod';

import { overlaySettingValueInLayoutFileSchema } from '../schemas/layout-file-schema';

export type LayoutOverlaySettingValue = z.infer<typeof overlaySettingValueInLayoutFileSchema>;
