import { z } from "zod";

const versionRegex = /^\d+\.\d+(\.\d+)?$/;

export const overlayManifestFileSchema = z.object({
  displayName: z.string().optional(),
  author: z.string().optional(),
  version: z.string().regex(versionRegex, "Invalid version format").optional(),
  defaultWindowWidth: z.number().optional(),
  defaultWindowHeight: z.number().optional(),
  lastModified: z.number().optional(),
  image: z.string().optional(),
  description: z.string().optional(),
  category: z.string().optional(),
});
