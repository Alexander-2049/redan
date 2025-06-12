import { OVERLAYS_PATH } from "@/main/main-constants";
import fs from "fs";
import path from "path";
import { overlayManifestFileSchema } from "./schemas";
import { overlayServer } from ".";
import { OverlayAndFolderName } from "@/shared/types/overlay-and-folder-name";
import { jsonFileHandler } from "../json-file-service";
import { overlayServiceLogger as logger } from "@/main/loggers";
import { OverlayManifest } from "./types";

export class OverlayHandler {
  static loadAllOverlays() {
    logger.info("Loading all overlays...");

    if (!fs.existsSync(OVERLAYS_PATH)) {
      logger.info(`Overlays folder does not exist at: ${OVERLAYS_PATH}`);
      fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
      logger.info(`Created overlays folder at: ${OVERLAYS_PATH}`);
    }

    const dir = fs.readdirSync(OVERLAYS_PATH);
    const folders = dir.filter((item) =>
      fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory(),
    );

    logger.debug(`Found overlay folders: ${folders.join(", ")}`);

    const overlaysData: OverlayAndFolderName[] = folders.reduce(
      (acc: OverlayAndFolderName[], folderName) => {
        const folderPath = path.join(OVERLAYS_PATH, folderName);
        const manifestPath = path.join(folderPath, "manifest.json");

        try {
          logger.debug(`Reading manifest: ${manifestPath}`);
          const manifest = jsonFileHandler.read(manifestPath);

          const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

          if (parsedManifest.success) {
            logger.info(
              `Successfully parsed manifest in folder: ${folderName}`,
            );
            acc.push({
              folderName,
              data: parsedManifest.data,
            });
          } else {
            logger.warn(`Invalid manifest schema in folder: ${folderName}`);
          }
        } catch (error) {
          logger.error(
            `[1] Error reading or parsing manifest.json in folder ${folderName}:`,
            error,
          );
        }

        return acc;
      },
      [],
    );

    logger.info(`Loaded ${overlaysData.length} overlays successfully.`);
    return overlaysData;
  }

  static loadOverlayManifest(folderName: string): OverlayManifest | null {
    const folderPath = path.join(OVERLAYS_PATH, folderName);
    const manifestPath = path.join(folderPath, "manifest.json");

    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      logger.debug(`Attempting to load manifest from: ${manifestPath}`);
      try {
        const manifest = jsonFileHandler.read(manifestPath);
        const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

        if (parsedManifest.success) {
          logger.info(
            `Successfully loaded manifest for overlay: ${folderName}`,
          );
          return parsedManifest.data;
        } else {
          logger.warn(`Manifest schema validation failed for: ${folderName}`);
        }
      } catch (error) {
        logger.error(
          `[2] Error reading or parsing manifest.json in folder ${folderName}:`,
          error,
        );
      }
    } else {
      logger.warn(
        `Overlay folder does not exist or is not a directory: ${folderPath}`,
      );
    }

    return null;
  }

  static get server() {
    logger.debug("Accessed overlay server instance.");
    return overlayServer;
  }
}
