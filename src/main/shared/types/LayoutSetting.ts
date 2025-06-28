import { z } from 'zod';

import { layoutSettingsFileSchema } from '../schemas/layout-settings-file-schema';

export type LayoutSettings = z.infer<typeof layoutSettingsFileSchema>;
