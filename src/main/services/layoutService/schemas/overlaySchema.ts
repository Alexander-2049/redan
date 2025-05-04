import { z } from "zod";

export const overlayPositionSchema = z.object({
  width: z.number(),
  height: z.number(),
  x: z.number(),
  y: z.number(),
});

export const overlaySettingSchema = z.object({
  id: z.string(),
  value: z.union([z.number(), z.string(), z.boolean()]),
});

export const overlaySchema = z.object({
  id: z.string(),
  folderName: z.string(),
  name: z.string(),
  settings: z.array(overlaySettingSchema),
  visible: z.boolean(),
  position: overlayPositionSchema,
});

export type ILayoutOverlay = z.infer<typeof overlaySchema>;
export type ILayoutOverlaySetting = z.infer<typeof overlaySettingSchema>;
