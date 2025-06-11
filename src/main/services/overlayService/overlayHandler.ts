import { OVERLAYS_PATH } from "@/main/main-constants";
import fs from "fs";
import path from "path";
import { overlayManifestFileSchema } from "./schemas/overlayManifest";
import app from "./overlayServer";
import { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import { z } from "zod";
import JsonFileHandler from "../json-file-service";
import { uiServiceLogger } from "@/main/loggers";

const jsonFileHandler = new JsonFileHandler();

export default class OverlayHandler {
  public static createOverlaysFolder() {
    if (!fs.existsSync(OVERLAYS_PATH)) {
      fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
      uiServiceLogger.info(`Created overlays folder at: ${OVERLAYS_PATH}`);
      return true;
    } else {
      uiServiceLogger.debug(
        `Overlays folder already exists at: ${OVERLAYS_PATH}`,
      );
      return false;
    }
  }

  static loadAllOverlays() {
    uiServiceLogger.info("Loading all overlays...");
    this.createOverlaysFolder();

    const dir = fs.readdirSync(OVERLAYS_PATH);
    const folders = dir.filter((item) =>
      fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory(),
    );

    uiServiceLogger.debug(`Found overlay folders: ${folders.join(", ")}`);

    const overlaysData: IOverlayAndFolderName[] = folders.reduce(
      (acc: IOverlayAndFolderName[], folderName) => {
        const folderPath = path.join(OVERLAYS_PATH, folderName);
        const manifestPath = path.join(folderPath, "manifest.json");

        try {
          uiServiceLogger.debug(`Reading manifest: ${manifestPath}`);
          const manifest = jsonFileHandler.read(manifestPath);

          const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

          if (parsedManifest.success) {
            uiServiceLogger.info(
              `Successfully parsed manifest in folder: ${folderName}`,
            );
            acc.push({
              folderName,
              data: parsedManifest.data,
            });
          } else {
            uiServiceLogger.warn(
              `Invalid manifest schema in folder: ${folderName}`,
            );
          }
        } catch (error) {
          uiServiceLogger.error(
            `Error reading or parsing manifest.json in folder ${folderName}:`,
            error,
          );
        }

        return acc;
      },
      [],
    );

    uiServiceLogger.info(
      `Loaded ${overlaysData.length} overlays successfully.`,
    );
    return overlaysData;
  }

  static loadOverlayManifest(
    folderName: string,
  ): z.infer<typeof overlayManifestFileSchema> | null {
    this.createOverlaysFolder();

    const folderPath = path.join(OVERLAYS_PATH, folderName);
    const manifestPath = path.join(folderPath, "manifest.json");

    if (fs.existsSync(folderPath) && fs.statSync(folderPath).isDirectory()) {
      uiServiceLogger.debug(
        `Attempting to load manifest from: ${manifestPath}`,
      );
      try {
        const manifest = jsonFileHandler.read(manifestPath);
        const parsedManifest = overlayManifestFileSchema.safeParse(manifest);

        if (parsedManifest.success) {
          uiServiceLogger.info(
            `Successfully loaded manifest for overlay: ${folderName}`,
          );
          return parsedManifest.data;
        } else {
          uiServiceLogger.warn(
            `Manifest schema validation failed for: ${folderName}`,
          );
        }
      } catch (error) {
        uiServiceLogger.error(
          `Error reading or parsing manifest.json in folder ${folderName}:`,
          error,
        );
      }
    } else {
      uiServiceLogger.warn(
        `Overlay folder does not exist or is not a directory: ${folderPath}`,
      );
    }

    return null;
  }

  static get server() {
    uiServiceLogger.debug("Accessed overlay server instance.");
    return app;
  }
}
