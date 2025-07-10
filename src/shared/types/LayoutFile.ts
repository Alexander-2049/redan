import { z } from 'zod';

import { layoutFileSchema } from '../../main/shared/schemas/layout-file-schema';

export type LayoutFile = z.infer<typeof layoutFileSchema>;
