import { OVERLAYS_PATH } from "@/main/main-constants";
import fs from "fs";
import path from "path";
import { overlayManifestFileSchema } from "./schemas/overlayManifest";
import app from "./overlayServer";
import { IOverlayAndFolderName } from "@/shared/types/IOverlay";

export default class OverlayHandler {
  static setup() {
    this.createOverlaysFolder();
  }

  private static createOverlaysFolder() {
    if (!fs.existsSync(OVERLAYS_PATH)) {
      fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
      return true;
    } else {
      return false;
    }
  }

  static getAll() {
    this.setup();

    const dir = fs.readdirSync(OVERLAYS_PATH);
    const folders = dir.filter((item) =>
      fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory(),
    );

    const overlaysData: IOverlayAndFolderName[] = folders.map((folderName) => {
      const overlay: IOverlayAndFolderName = {
        folderName,
        data: {},
      };

      const folderPath = path.join(OVERLAYS_PATH, folderName);
      const manifestPath = path.join(folderPath, "manifest.json");

      if (fs.existsSync(manifestPath)) {
        try {
          const manifestContent = fs.readFileSync(manifestPath, "utf-8");
          const manifest = JSON.parse(manifestContent);

          const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

          if (parsedManifest.success) {
            overlay.data = parsedManifest.data;

            return overlay;
          }
        } catch (error) {
          console.error(
            `Error parsing manifest.json in folder ${folderName}:`,
            error,
          );
        }
      }

      return overlay;
    });

    return overlaysData;
  }

  static get server() {
    return app;
  }
}
