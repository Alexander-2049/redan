import { overlayManifestFileSchema } from "../schemas";
import { z } from "zod";

export type OverlayManifest = z.infer<typeof overlayManifestFileSchema>;
