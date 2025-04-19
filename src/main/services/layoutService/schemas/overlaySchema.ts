import { z } from "zod";

export const overlayOptionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("range"),
    name: z.string(),
    min: z.number(),
    max: z.number(),
    step: z.number(),
    unit: z.enum(["number", "percentage"]).optional(),
    group: z.string().optional(),
  }),
  z.object({
    type: z.literal("toggle"),
    name: z.string(),
    state: z.enum(["ON", "OFF"]),
    group: z.string().optional(),
  }),
  z.object({
    type: z.literal("select"),
    name: z.string(),
    selectList: z.array(z.string()),
    group: z.string().optional(),
  }),
  z.object({
    type: z.literal("integer"),
    name: z.string(),
    value: z.number().int().optional(),
    group: z.string().optional(),
  }),
  z.object({
    type: z.literal("string"),
    name: z.string(),
    value: z.string().optional(),
    group: z.string().optional(),
  }),
]);

export const overlaySchema = z.object({
  folderName: z.string(),
  options: z.array(overlayOptionSchema),
  isVisible: z.boolean(),
  isDraggable: z.boolean(),
  isResizable: z.boolean(),
  width: z.number(),
  height: z.number(),
  x: z.number(),
  y: z.number(),
});
