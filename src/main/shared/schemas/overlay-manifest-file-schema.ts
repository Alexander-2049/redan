// %steam%/Workshop/Content/${WORKSHOP_ID}/manifest.json
import { z } from 'zod';

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

export const overlaySettingDescriptionSchema = z.discriminatedUnion('type', [
  // requiredFields is used to tell the user, that this setting will not work in a specific game (because some field is not available)
  z.object({
    id: z.string(),
    type: z.literal('slider'),
    name: z.string(),
    min: z.number(),
    max: z.number(),
    step: z.number(),
    unit: z.enum(['number', 'percentage']).nullable(),
    group: z.string().nullable(),
    defaultValue: z.number(),
    requiredFields: z.array(z.string()),
  }),
  z.object({
    id: z.string(),
    type: z.literal('toggle'),
    name: z.string(),
    group: z.string().nullable(),
    defaultValue: z.boolean(),
    requiredFields: z.array(z.string()),
  }),
  z.object({
    id: z.string(),
    type: z.literal('select'),
    name: z.string(),
    selectList: z.array(
      z.object({
        id: z.string(),
        value: z.string(),
      }),
    ),
    group: z.string().nullable(),
    defaultValue: z.string(),
    requiredFields: z.array(z.string()),
  }),
  z.object({
    id: z.string(),
    type: z.literal('number'),
    name: z.string(),
    group: z.string().nullable(),
    min: z.number().optional(),
    max: z.number().optional(),
    defaultValue: z.number(),
    requiredFields: z.array(z.string()),
  }),
  z.object({
    id: z.string(),
    type: z.literal('string'),
    name: z.string(),
    group: z.string().nullable(),
    defaultValue: z.string(),
    requiredFields: z.array(z.string()),
  }),
  z.object({
    id: z.string(),
    type: z.literal('color'),
    name: z.string(),
    group: z.string().nullable(),
    defaultValue: z.string().regex(hexColorRegex, { message: 'Invalid hex color' }),
    requiredFields: z.array(z.string()),
  }),
]);

export const overlayManifestFileSchema = z.object({
  title: z.string(), // Title will be used both in Steam Workshop and in application overlay list
  description: z.string().optional(), // Description will be available only in Workshop item list
  tags: z.array(z.string()), // Tags are required to make overlay searching in Steam Workshop easier
  dimentions: z.object({
    defaultWidth: z.number(), // These two values will be used to define overlay size on spawn AND overlay size in preview
    defaultHeight: z.number(), // These two values will be used to define overlay size on spawn AND overlay size in preview
    minWidth: z.number().min(20).max(1920),
    minHeight: z.number().min(20).max(1920),
    maxWidth: z.number().min(20).max(1920),
    maxHeight: z.number().min(20).max(1920),
  }),
  settings: z.array(overlaySettingDescriptionSchema),
  requiredFields: z.array(z.string()),
  optionalFields: z.array(z.string()),
});
