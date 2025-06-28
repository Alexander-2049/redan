import { overlayManifestFileSchema } from "@/main/_/overlay-service/schemas";
import { z } from "zod";

export interface OverlayAndFolderName {
  folderName: string;
  data: z.infer<typeof overlayManifestFileSchema>;
}
