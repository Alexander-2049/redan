import { z } from "zod";

const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;

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
    group: z.string().optional(),
    defaultValue: z.string(),
  }),
  z.object({
    id: z.string(),
    type: z.literal("color"),
    name: z.string(),
    group: z.string().optional(),
    defaultValue: z
      .string()
      .regex(hexColorRegex, { message: "Invalid hex color" }),
  }),
]);
