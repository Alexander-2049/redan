import { z } from "zod";
import { overlaySchema } from "./overlaySchema";

export const layoutSchema = z.object({
  name: z.string(),
  active: z.boolean(),
  description: z.string().optional(),
  overlays: z.array(overlaySchema),
  screenWidth: z.number(),
  screenHeight: z.number(),
  locked: z.boolean(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type ILayout = z.infer<typeof layoutSchema>;

export interface ILayoutDataAndFilename {
  data: ILayout;
  filename: string;
}
