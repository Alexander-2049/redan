import { z } from "zod";

const versionRegex = /^\d+\.\d+(\.\d+)?$/;

export const layoutSchema = z.object({
  folderName: z.string(),
  windowWidth: z.number().optional(),
  windowHeight: z.number().optional(),
});

export const overlayLayoutsFileSchema = z.object({
  version: z.string().regex(versionRegex, "Invalid version format").optional(),
  overlays: z.array(layoutSchema),
});
