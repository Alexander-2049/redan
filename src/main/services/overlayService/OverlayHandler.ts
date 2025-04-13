import {
  OVERLAYS_PATH,
  OVERLAYS_SETTINGS_FILE_PATH,
} from "@/main/main-constants";
import fs from "fs";
import path from "path";
import { overlayManifestFileSchema } from "./schemas/overlayManifest";
import app from "./overlayServer";
import { z } from "zod";
import { overlaySettingsFileSchema } from "./schemas/overlaySettings";
import { IOverlay } from "@/shared/types/IOverlay";

export type ISettings = z.infer<typeof overlaySettingsFileSchema>;
const settingsFileTemplate: ISettings = {
  version: "1.0",
  overlays: [],
};

export default class OverlayHandler {
  static setup() {
    this.createSettingsFile();
    this.createOverlaysFolder();
  }

  private static createSettingsFile() {
    if (!fs.existsSync(OVERLAYS_SETTINGS_FILE_PATH)) {
      fs.writeFileSync(
        OVERLAYS_SETTINGS_FILE_PATH,
        JSON.stringify(settingsFileTemplate, null, 4),
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
    if (!fs.existsSync(OVERLAYS_SETTINGS_FILE_PATH)) {
      this.createSettingsFile();
    }

    const fileContent = fs.readFileSync(OVERLAYS_SETTINGS_FILE_PATH, "utf-8");
    try {
      const parsedData = JSON.parse(fileContent);
      const result = overlaySettingsFileSchema.safeParse(parsedData);
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
  }

  static get server() {
    return app;
  }
}
