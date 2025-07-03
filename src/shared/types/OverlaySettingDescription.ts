import { z } from 'zod';

import { overlaySettingDescriptionSchema } from '@/main/shared/schemas/overlay-manifest-file-schema';
export type OverlaySettingDescription = z.infer<typeof overlaySettingDescriptionSchema>;
