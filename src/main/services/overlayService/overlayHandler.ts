import { OVERLAYS_PATH } from "@/main/main-constants";
import fs from "fs";
import path from "path";
import { overlayManifestFileSchema } from "./schemas/overlayManifest";
import app from "./overlayServer";
import { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import { z } from "zod";
import { jsonFileHandler } from "../json-file-service";
import { overlayServiceLogger } from "@/main/loggers";

export default class OverlayHandler {
  static loadAllOverlays() {
    overlayServiceLogger.info("Loading all overlays...");

    if (!fs.existsSync(OVERLAYS_PATH)) {
      overlayServiceLogger.info(
        `Overlays folder does not exist at: ${OVERLAYS_PATH}`,
      );
      fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
      overlayServiceLogger.info(`Created overlays folder at: ${OVERLAYS_PATH}`);
    }

    const dir = fs.readdirSync(OVERLAYS_PATH);
    const folders = dir.filter((item) =>
      fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory(),
    );

    overlayServiceLogger.debug(`Found overlay folders: ${folders.join(", ")}`);

    const overlaysData: IOverlayAndFolderName[] = folders.reduce(
      (acc: IOverlayAndFolderName[], folderName) => {
        const folderPath = path.join(OVERLAYS_PATH, folderName);
        const manifestPath = path.join(folderPath, "manifest.json");

        try {
          overlayServiceLogger.debug(`Reading manifest: ${manifestPath}`);
          const manifest = jsonFileHandler.read(manifestPath);

          const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

          if (parsedManifest.success) {
            overlayServiceLogger.info(
              `Successfully parsed manifest in folder: ${folderName}`,
            );
            acc.push({
              folderName,
              data: parsedManifest.data,
            });
          } else {
            overlayServiceLogger.warn(
              `Invalid manifest schema in folder: ${folderName}`,
            );
          }
        } catch (error) {
          overlayServiceLogger.error(
            `Error reading or parsing manifest.json in folder ${folderName}:`,
            error,
          );
        }

        return acc;
      },
      [],
    );

    overlayServiceLogger.info(
      `Loaded ${overlaysData.length} overlays successfully.`,
    );
    return overlaysData;
  }

  static loadOverlayManifest(
    folderName: string,
  ): z.infer<typeof overlayManifestFileSchema> | null {
    const folderPath = path.join(OVERLAYS_PATH, folderName);
    const manifestPath = path.join(folderPath, "manifest.json");

    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      overlayServiceLogger.debug(
        `Attempting to load manifest from: ${manifestPath}`,
      );
      try {
        const manifest = jsonFileHandler.read(manifestPath);
        const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

        if (parsedManifest.success) {
          overlayServiceLogger.info(
            `Successfully loaded manifest for overlay: ${folderName}`,
          );
          return parsedManifest.data;
        } else {
          overlayServiceLogger.warn(
            `Manifest schema validation failed for: ${folderName}`,
          );
        }
      } catch (error) {
        overlayServiceLogger.error(
          `Error reading or parsing manifest.json in folder ${folderName}:`,
          error,
        );
      }
    } else {
      overlayServiceLogger.warn(
        `Overlay folder does not exist or is not a directory: ${folderPath}`,
      );
    }

    return null;
  }

  static get server() {
    overlayServiceLogger.debug("Accessed overlay server instance.");
    return app;
  }
}
