import { z } from "zod";

const versionRegex = /^\d+\.\d+(\.\d+)?$/;

export type IOverlaySettingDescription = z.infer<
  typeof overlaySettingDescriptionSchema
>;

export const overlaySettingDescriptionSchema = z.discriminatedUnion("type", [
  z.object({
    id: z.string(),
    type: z.literal("slider"),
    name: z.string(),
    min: z.number(),
    max: z.number(),
    step: z.number(),
    unit: z.enum(["number", "percentage"]).optional(),
    group: z.string().optional(),
    defaultValue: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("toggle"),
    name: z.string(),
    group: z.string().optional(),
    defaultValue: z.boolean(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("select"),
    name: z.string(),
    selectList: z.array(
      z.object({
        id: z.string(),
        value: z.string(),
      }),
    ),
    group: z.string().optional(),
    defaultValue: z.string(), // id
  }),
  z.object({
    id: z.string(),
    type: z.literal("number"),
    name: z.string(),
    group: z.string().optional(),
    min: z.number().optional(),
    max: z.number().optional(),
    defaultValue: z.number(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("string"),
    name: z.string(),
    value: z.string().optional(),
    group: z.string().optional(),
    defaultValue: z.string(),
  }),
]);

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
