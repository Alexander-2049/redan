import { z } from "zod";
import { overlaySchema } from "./overlaySchema";

export const layoutSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  overlays: z.array(overlaySchema),
  screenWidth: z.number(),
  screenHeight: z.number(),
});

export type LayoutType = z.infer<typeof layoutSchema>;

export const defaultLayout: LayoutType = {
  name: "Layout #",
  description: "",
  overlays: [],
  screenWidth: 0,
  screenHeight: 0,
};
