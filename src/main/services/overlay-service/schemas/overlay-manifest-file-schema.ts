import { z } from "zod";
import { overlaySettingDescriptionSchema } from "./overlay-manifest-schema";

export const overlayManifestFileSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()),
  defaultWidth: z.number().optional().default(300),
  defaultHeight: z.number().optional().default(160),
  minWidth: z.number().optional().default(100),
  minHeight: z.number().optional().default(50),
  maxWidth: z.number().optional().default(1000),
  maxHeight: z.number().optional().default(700),
  settings: z.array(overlaySettingDescriptionSchema).optional(),
  requiredFields: z.array(z.string()),
  optionalFields: z.array(z.string()),
});
