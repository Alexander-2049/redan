import { OVERLAYS_PATH } from "../main-constants";
import fs from "fs";
import path from "path";
import { overlayManifestFileSchema } from "../../shared/schemas/settingsFileSchema";
import { z } from "zod";

export type OverlaySettings = z.infer<typeof overlayManifestFileSchema>;

export const createOverlaysFolder = () => {
  if (!fs.existsSync(OVERLAYS_PATH)) {
    fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
    return true;
  } else {
    return false;
  }
};

interface IOverlayData {
  displayName: string;
  folderName: string;
  author: string | null;
}

export const getOverlaysData = (): IOverlayData[] => {
  const dir = fs.readdirSync(OVERLAYS_PATH);
  const folders = dir.filter((item) =>
    fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory(),
  );

  const overlaysData: IOverlayData[] = folders.map((folderName) => {
    const folderPath = path.join(OVERLAYS_PATH, folderName);
    const manifestPath = path.join(folderPath, "manifest.json");

    if (fs.existsSync(manifestPath)) {
      try {
        const manifestContent = fs.readFileSync(manifestPath, "utf-8");
        const manifest = JSON.parse(manifestContent);

        const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

        if (parsedManifest.success) {
          return {
            displayName: parsedManifest.data.displayName || folderName,
            folderName,
            author: parsedManifest.data.authorName || null,
          };
        }
      } catch (error) {
        console.error(
          `Error parsing manifest.json in folder ${folderName}:`,
          error,
        );
      }
    }

    return {
      displayName: folderName,
      folderName,
      author: null,
    };
  });

  return overlaysData;
};
