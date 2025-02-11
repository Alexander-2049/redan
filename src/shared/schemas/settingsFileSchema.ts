import { z } from "zod";

const versionRegex = /^\d+\.\d+(\.\d+)?$/;

export const overlaySettingsSchema = z.object({
  folderName: z.string(),
  windowWidth: z.number(),
  windowHeight: z.number(),
  windowPositionX: z.number(),
  windowPositionY: z.number(),
  clickThrough: z.boolean(),
  resizable: z.boolean(),
  draggable: z.boolean(),
});

export const settingsFileSchema = z.object({
  version: z.string().regex(versionRegex, "Invalid version format"),
  overlays: z.array(overlaySettingsSchema),
});
