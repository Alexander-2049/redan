import {
  OVERLAYS_PATH,
  OVERLAYS_LAYOUTS_FILE_PATH,
} from "@/main/main-constants";
import fs from "fs";
import path from "path";
import { overlayManifestFileSchema } from "./schemas/overlayManifest";
import app from "./overlayServer";
import { z } from "zod";
import { overlayLayoutsFileSchema } from "./schemas/overlaySettings";
import { IOverlay } from "@/shared/types/IOverlay";

export type ILayouts = z.infer<typeof overlayLayoutsFileSchema>;
const layoutsFileTemplate: ILayouts = {
  version: "1.0",
  layouts: [],
};

export default class OverlayHandler {
  static setup() {
    this.createLayoutsFile();
    this.createOverlaysFolder();
  }

  private static createLayoutsFile() {
    if (!fs.existsSync(OVERLAYS_LAYOUTS_FILE_PATH)) {
      fs.writeFileSync(
        OVERLAYS_LAYOUTS_FILE_PATH,
        JSON.stringify(layoutsFileTemplate, null, 4),
      );
    }
  }

  private static createOverlaysFolder() {
    if (!fs.existsSync(OVERLAYS_PATH)) {
      fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
      return true;
    } else {
      return false;
    }
  }

  static readSettings() {
    if (!fs.existsSync(OVERLAYS_LAYOUTS_FILE_PATH)) {
      this.createLayoutsFile();
    }

    const fileContent = fs.readFileSync(OVERLAYS_LAYOUTS_FILE_PATH, "utf-8");
    try {
      const parsedData = JSON.parse(fileContent);
      const result = overlayLayoutsFileSchema.safeParse(parsedData);
      if (!result.success) {
        console.error("Invalid settings file format:", result.error.format());
        return null;
      }
      return result.data;
    } catch (error) {
      console.error("Error reading settings file:", error);
      return null;
    }
  }

  static getAll() {
    const dir = fs.readdirSync(OVERLAYS_PATH);
    const folders = dir.filter((item) =>
      fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory(),
    );

    const overlaysData: IOverlay[] = folders.map((folderName) => {
      const data: IOverlay = {
        displayName: folderName,
        folderName,
        author: null,
        category: "unknown",
        image: null,
        description: null,
        downloads: 0,
        rating: 0,
      };

      const folderPath = path.join(OVERLAYS_PATH, folderName);
      const manifestPath = path.join(folderPath, "manifest.json");

      if (fs.existsSync(manifestPath)) {
        try {
          const manifestContent = fs.readFileSync(manifestPath, "utf-8");
          const manifest = JSON.parse(manifestContent);

          const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

          if (parsedManifest.success) {
            data.author = parsedManifest.data.author || null;
            data.category = parsedManifest.data.category || null;
            data.description = parsedManifest.data.description || null;
            data.displayName = parsedManifest.data.displayName || folderName;
            data.image = parsedManifest.data.image || null;
            data.downloads = null;
            data.rating = null;

            return data;
          }
        } catch (error) {
          console.error(
            `Error parsing manifest.json in folder ${folderName}:`,
            error,
          );
        }
      }

      return data;
    });

    return overlaysData;
  }

  static get server() {
    return app;
  }
}
