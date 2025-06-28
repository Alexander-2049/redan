import { z } from 'zod';
import { overlaySettingInLayoutFileSchema } from '../schemas/layout-file-schema';

export type LayoutOverlaySetting = z.infer<typeof overlaySettingInLayoutFileSchema>;
