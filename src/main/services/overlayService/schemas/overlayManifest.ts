import { z } from "zod";

const versionRegex = /^\d+\.\d+(\.\d+)?$/;

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
  }),
  z.object({
    id: z.string(),
    type: z.literal("toggle"),
    name: z.string(),
    state: z.enum(["ON", "OFF"]),
    group: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("select"),
    name: z.string(),
    selectList: z.array(z.string()),
    group: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("integer"),
    name: z.string(),
    value: z.number().int().optional(),
    group: z.string().optional(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("string"),
    name: z.string(),
    value: z.string().optional(),
    group: z.string().optional(),
  }),
]);

export const overlayManifestFileSchema = z.object({
  name: z.string().optional(),
  author: z.string().optional(),
  version: z.string().regex(versionRegex, "Invalid version format").optional(),
  defaultWindowWidth: z.number().optional(),
  defaultWindowHeight: z.number().optional(),
  lastModified: z.number().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  type: z.string().optional(),
  settings: z.array(overlaySettingDescriptionSchema).optional(),
});
