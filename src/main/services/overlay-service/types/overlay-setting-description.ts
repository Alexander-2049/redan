import { z } from "zod";
import { overlaySettingDescriptionSchema } from "../schemas";

export type OverlaySettingDescription = z.infer<
  typeof overlaySettingDescriptionSchema
>;
