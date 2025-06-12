import { z } from "zod";
import { overlaySettingDescriptionSchema } from "./overlay-manifest-schema";
const versionRegex = /^\d+\.\d+(\.\d+)?$/;

export const overlayManifestFileSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  author: z.string().optional(),
  version: z.string().regex(versionRegex, "Invalid version format").optional(),
  defaultWidth: z.number().optional().default(300),
  defaultHeight: z.number().optional().default(160),
  minWidth: z.number().optional().default(100),
  minHeight: z.number().optional().default(50),
  maxWidth: z.number().optional().default(1000),
  maxHeight: z.number().optional().default(700),
  publishDate: z.number().optional(),
  settings: z.array(overlaySettingDescriptionSchema).optional(),
});
