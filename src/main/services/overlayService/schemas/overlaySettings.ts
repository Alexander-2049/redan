import { z } from "zod";

const versionRegex = /^\d+\.\d+(\.\d+)?$/;

export const layoutSchema = z.object({
  displayName: z.string(),
});

export const overlayLayoutsFileSchema = z.object({
  version: z.string().regex(versionRegex, "Invalid version format").optional(),
  layouts: z.array(layoutSchema),
});
