import { overlayManifestFileSchema } from "@/main/services/overlayService/schemas/overlayManifest";
import { z } from "zod";

export interface IOverlayAndFolderName {
  folderName: string;
  data: z.infer<typeof overlayManifestFileSchema>;
}
