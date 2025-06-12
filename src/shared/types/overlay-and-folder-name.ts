import { overlayManifestFileSchema } from "@/main/services/overlay-service/schemas";
import { z } from "zod";

export interface OverlayAndFolderName {
  folderName: string;
  data: z.infer<typeof overlayManifestFileSchema>;
}
