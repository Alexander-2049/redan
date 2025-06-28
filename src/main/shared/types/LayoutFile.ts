import { z } from 'zod';
import { layoutFileSchema } from '../schemas/layout-file-schema';

export type LayoutFile = z.infer<typeof layoutFileSchema>;
