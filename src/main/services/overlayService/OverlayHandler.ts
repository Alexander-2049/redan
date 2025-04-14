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
  overlays: [],
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
              author: parsedManifest.data.author || null,
              category: parsedManifest.data.category || "unknown",
              image:
                parsedManifest.data.image ||
                "https://kzml8tdlacqptj5ggjfc.lite.vusercontent.net/placeholder.svg?height=200&width=350",
              description: parsedManifest.data.description || "",
              downloads: 1,
              rating: 5,
              lastModified: 0,
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
        category: "unknown",
        image:
          "https://kzml8tdlacqptj5ggjfc.lite.vusercontent.net/placeholder.svg?height=200&width=350",
        description: "",
        downloads: 1,
        rating: 5,
        lastModified: 0,
      };
    });

    return overlaysData;
  }

  static get server() {
    return app;
  }
}
