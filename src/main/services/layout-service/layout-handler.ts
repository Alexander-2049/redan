import { LAYOUTS_PATH } from "@/main/main-constants";
import fs from "fs";
import {
  layoutSchema,
  ILayout,
  ILayoutDataAndFilename as LayoutDataAndFilename,
} from "./schemas/layoutSchema";
import sanitize from "sanitize-filename";
import { overlaySchema } from "./schemas/overlaySchema";
import { z } from "zod";
import { OverlayHandler } from "../overlay-service/overlay-handler";
import { jsonFileHandler } from "../json-file-service";
import path from "path";
import EventEmitter from "events";

interface CreateNewLayoutResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}

type DefaultResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

interface ModifyLayoutResponse {
  success: boolean;
  error?: string;
}

export type LayoutResponse =
  | {
      success: boolean;
      layouts: LayoutDataAndFilename[];
      error?: undefined;
    }
  | {
      success: boolean;
      error: string;
      layouts?: undefined;
    };

class LayoutHandler extends EventEmitter {
  public setup() {
    this.createLayoutsFolder();
  }

  private createLayoutsFolder() {
    if (!fs.existsSync(LAYOUTS_PATH)) {
      fs.mkdirSync(LAYOUTS_PATH, { recursive: true });
      return true;
    } else {
      return false;
    }
  }

  public createNewLayout({
    layoutName,
    description,
    screenWidth,
    screenHeight,
  }: {
    layoutName: string;
    description: string;
    screenWidth: number;
    screenHeight: number;
  }): CreateNewLayoutResponse {
    this.setup();

    let sanitizedFileName = sanitize(layoutName);
    let filePath = path.join(`${LAYOUTS_PATH}`, `${sanitizedFileName}.json`);
    let counter = 1;

    // Check if file already exists and append a postfix if necessary
    while (fs.existsSync(filePath)) {
      sanitizedFileName = `${sanitize(layoutName)}(${counter})`;
      filePath = path.join(`${LAYOUTS_PATH}`, `${sanitizedFileName}.json`);
      counter++;
    }

    const newLayout: ILayout = {
      name: layoutName,
      active: false,
      description,
      overlays: [],
      screenWidth,
      screenHeight,
      locked: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const parsedLayout = layoutSchema.parse(newLayout);
      jsonFileHandler.write(filePath, parsedLayout, true);
      return { success: true, filePath };
    } catch (error) {
      console.error("Error creating new layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public getAllLayouts(): LayoutResponse {
    this.setup();

    try {
      const files = fs.readdirSync(LAYOUTS_PATH);
      const layouts: LayoutDataAndFilename[] = [];

      files
        .filter((file) => file.endsWith(".json"))
        .forEach((file) => {
          const filePath = `${LAYOUTS_PATH}/${file}`;
          try {
            const content = jsonFileHandler.read(filePath);
            layouts.push({
              filename: file,
              data: layoutSchema.parse(content),
            });
          } catch (error) {
            console.warn(`Skipping invalid layout file: ${file}`, error);
          }
        });

      return { success: true, layouts };
    } catch (error) {
      console.error("Error reading all layouts:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public getLayout(fileName: string) {
    this.setup();

    try {
      const filePath = `${LAYOUTS_PATH}/${fileName}.json`;
      if (!fs.existsSync(filePath)) {
        throw new Error("Layout file does not exist");
      }
      const content = jsonFileHandler.read(filePath);
      const layout = layoutSchema.parse(content);
      return { success: true, layout };
    } catch (error) {
      console.error("Error reading layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public modifyLayout(
    fileName: string,
    updatedData: Partial<ILayout>,
  ): ModifyLayoutResponse {
    this.setup();

    try {
      const filePath = `${LAYOUTS_PATH}/${fileName}`;
      if (!fs.existsSync(filePath)) {
        throw new Error("Layout file does not exist");
      }
      const content = jsonFileHandler.read(filePath);
      const existingLayout = layoutSchema.parse(content);
      const updatedLayout = layoutSchema.parse({
        ...existingLayout,
        ...updatedData,
        updatedAt: Date.now(),
      });
      jsonFileHandler.write(filePath, updatedLayout, true);
      this.emit("modified", { fileName, updatedLayout });
      return { success: true };
    } catch (error) {
      console.error("Error modifying layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public deleteLayout(fileName: string): DefaultResponse {
    this.setup();

    try {
      const filePath = `${LAYOUTS_PATH}/${fileName}`;
      if (!fs.existsSync(filePath)) {
        throw new Error("Layout file does not exist");
      }
      fs.unlinkSync(filePath);
      return { success: true };
    } catch (error) {
      console.error("Error deleting layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public addOverlay(
    layoutFileName: string,
    overlayFolderName: string,
  ): DefaultResponse {
    this.setup();

    const overlayManifest =
      OverlayHandler.loadOverlayManifest(overlayFolderName);
    if (!overlayManifest) {
      return {
        success: false,
        error: "Overlay manifest could not be loaded",
      };
    }

    try {
      const layoutFilePath = `${LAYOUTS_PATH}/${layoutFileName}`;
      if (!fs.existsSync(layoutFilePath)) {
        throw new Error("Layout file does not exist");
      }

      const content = jsonFileHandler.read(layoutFilePath);
      const existingLayout = layoutSchema.parse(content);

      const newOverlay: z.infer<typeof overlaySchema> = {
        id: crypto.randomUUID(),
        name: overlayManifest.title || overlayFolderName,
        folderName: overlayFolderName,
        settings: [],
        visible: true,
        position: {
          width: overlayManifest.defaultWidth || 320,
          height: overlayManifest.defaultHeight || 180,
          x: 128,
          y: 72,
        },
      };

      if (overlayManifest.settings) {
        for (let i = 0; i < (overlayManifest.settings.length || 0); i++) {
          const setting = overlayManifest.settings[i];
          newOverlay.settings.push({
            id: setting.id,
            value: setting.defaultValue,
          });
        }
      }

      const updatedLayout = layoutSchema.parse({
        ...existingLayout,
        overlays: [...existingLayout.overlays, newOverlay],
        updatedAt: Date.now(),
      });

      jsonFileHandler.write(layoutFilePath, updatedLayout, true);

      return { success: true };
    } catch (error) {
      console.error("Error adding overlay:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public removeOverlay(layoutFileName: string, overlayId: string) {
    this.setup();

    try {
      const layoutFilePath = `${LAYOUTS_PATH}/${layoutFileName}`;
      if (!fs.existsSync(layoutFilePath)) {
        throw new Error("Layout file does not exist");
      }

      const content = jsonFileHandler.read(layoutFilePath);
      const existingLayout = layoutSchema.parse(content);

      const updatedOverlays = existingLayout.overlays.filter(
        (overlay) => overlay.id !== overlayId,
      );

      if (updatedOverlays.length === existingLayout.overlays.length) {
        return {
          success: false,
          error: "Overlay not found in the layout",
        };
      }

      const updatedLayout = layoutSchema.parse({
        ...existingLayout,
        overlays: updatedOverlays,
        updatedAt: Date.now(),
      });

      jsonFileHandler.write(layoutFilePath, updatedLayout, true);

      return { success: true };
    } catch (error) {
      console.error("Error removing overlay:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public setActiveLayout(layoutFileName: string): DefaultResponse {
    this.setup();

    try {
      const layouts = this.getAllLayouts();
      if (!layouts.success || !layouts.layouts) {
        throw new Error(layouts.error || "Failed to retrieve layouts");
      }

      layouts.layouts.forEach(({ filename, data }) => {
        const isActive = filename === layoutFileName;
        const updatedLayout = layoutSchema.parse({
          ...data,
          active: isActive,
        });

        const filePath = `${LAYOUTS_PATH}/${filename}`;
        jsonFileHandler.write(filePath, updatedLayout, true);
      });

      return { success: true };
    } catch (error) {
      console.error("Error setting active layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

const layoutHandler = new LayoutHandler();
export {
  CreateNewLayoutResponse,
  DefaultResponse,
  ModifyLayoutResponse,
  layoutHandler as LayoutHandler,
};
