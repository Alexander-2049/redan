import { z } from 'zod';

export const layoutSettingsFileSchema = z.object({
  activeLayoutFilename: z.string().nullable(),
  layoutOrder: z.array(z.string()),
});
