// %appdata%/SimRacingToolkit/Layouts/${LAYOUT_FILENAME}
import { z } from 'zod';

export const overlaySizeInLayoutFileSchema = z.object({
  width: z.number(),
  height: z.number(),
});

export const overlayPositionInLayoutFileSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const overlaySettingValueInLayoutFileSchema = z.union([z.number(), z.string(), z.boolean()]);

export const overlaySettingInLayoutFileSchema = z.object({
  id: z.string(),
  value: overlaySettingValueInLayoutFileSchema,
});

export const overlayInLayoutFileSchema = z.object({
  id: z.string(),
  baseUrl: z.string(),
  title: z.string(),
  settings: z.array(overlaySettingInLayoutFileSchema),
  visible: z.boolean(),
  position: overlayPositionInLayoutFileSchema,
  size: overlaySizeInLayoutFileSchema,
});

export const layoutFileSchema = z.object({
  game: z.string(), // Defines which game this layout used for
  title: z.string(),
  overlays: z.array(overlayInLayoutFileSchema),
  screen: z.object({
    width: z.number(),
    height: z.number(),
  }),
});
