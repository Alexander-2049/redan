import { z } from "zod";

const versionRegex = /^\d+\.\d+(\.\d+)?$/;

export const overlaySettingsSchema = z.object({
  folderName: z.string(),
  windowWidth: z.number().optional(),
  windowHeight: z.number().optional(),
});

export const overlaySettingsFileSchema = z.object({
  version: z.string().regex(versionRegex, "Invalid version format").optional(),
  overlays: z.array(overlaySettingsSchema),
});
