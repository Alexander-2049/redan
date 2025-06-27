// type NotSettingsJson<T extends string> = T extends "settings.json" ? never : T;

// export class Layout {
//   public static create(filename: NotSettingsJson<string>) {

//   }

//   public static
// }

/*
import { z } from "zod";
import { overlaySchema } from "./overlaySchema";

export const layoutSchema = z.object({
  name: z.string(),
  overlays: z.array(overlaySchema),
  screenWidth: z.number(),
  screenHeight: z.number(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export type ILayout = z.infer<typeof layoutSchema>;

export interface ILayoutDataAndFilename {
  data: ILayout;
  filename: string;
}

*/
