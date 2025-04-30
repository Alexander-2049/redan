import { LAYOUTS_PATH } from "@/main/main-constants";
import fs from "fs";
import {
  layoutSchema,
  ILayout,
  ILayoutDataAndFilename,
} from "./schemas/layoutSchema";
import sanitize from "sanitize-filename";
import { overlaySchema } from "./schemas/overlaySchema";
import { z } from "zod";
import OverlayHandler from "../overlayService/overlayHandler";

interface ICreateNewLayoutResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}

type IResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

interface IModifyLayoutResponse {
  success: boolean;
  error?: string;
}

export type ILayoutResponse =
  | {
      success: boolean;
      layouts: ILayoutDataAndFilename[];
      error?: undefined;
    }
  | {
      success: boolean;
      error: string;
      layouts?: undefined;
    };

class LayoutHandler {
  public static setup() {
    this.createLayoutsFolder();
  }

  private static createLayoutsFolder() {
    if (!fs.existsSync(LAYOUTS_PATH)) {
      fs.mkdirSync(LAYOUTS_PATH, { recursive: true });
      return true;
    } else {
      return false;
    }
  }

  public static createNewLayout({
    layoutName,
    description,
    screenWidth,
    screenHeight,
  }: {
    layoutName: string;
    description: string;
    screenWidth: number;
    screenHeight: number;
  }): ICreateNewLayoutResponse {
    this.setup();

    let sanitizedFileName = sanitize(layoutName);
    let filePath = `${LAYOUTS_PATH}/${sanitizedFileName}.json`;
    let counter = 1;

    // Check if file already exists and append a postfix if necessary
    while (fs.existsSync(filePath)) {
      sanitizedFileName = `${sanitize(layoutName)}(${counter})`;
      filePath = `${LAYOUTS_PATH}/${sanitizedFileName}.json`;
      counter++;
    }

    const newLayout: ILayout = {
      name: layoutName,
      active: false,
      description,
      overlays: [],
      screenWidth,
      screenHeight,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      const parsedLayout = layoutSchema.parse(newLayout);
      fs.writeFileSync(
        filePath,
        JSON.stringify(parsedLayout, null, 2),
        "utf-8",
      );
      return { success: true, filePath };
    } catch (error) {
      console.error("Error creating new layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public static getAllLayouts(): ILayoutResponse {
    this.setup();

    try {
      const files = fs.readdirSync(LAYOUTS_PATH);
      const layouts: ILayoutDataAndFilename[] = [];

      files
        .filter((file) => file.endsWith(".json"))
        .forEach((file) => {
          const filePath = `${LAYOUTS_PATH}/${file}`;
          try {
            const content = fs.readFileSync(filePath, "utf-8");
            layouts.push({
              filename: file,
              data: layoutSchema.parse(JSON.parse(content)),
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

  public static getLayout(fileName: string) {
    this.setup();

    try {
      const filePath = `${LAYOUTS_PATH}/${fileName}.json`;
      if (!fs.existsSync(filePath)) {
        throw new Error("Layout file does not exist");
      }
      const content = fs.readFileSync(filePath, "utf-8");
      const layout = layoutSchema.parse(JSON.parse(content));
      return { success: true, layout };
    } catch (error) {
      console.error("Error reading layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public static modifyLayout(
    fileName: string,
    updatedData: Partial<ILayout>,
  ): IModifyLayoutResponse {
    this.setup();

    try {
      const filePath = `${LAYOUTS_PATH}/${fileName}`;
      if (!fs.existsSync(filePath)) {
        throw new Error("Layout file does not exist");
      }
      const content = fs.readFileSync(filePath, "utf-8");
      const existingLayout = layoutSchema.parse(JSON.parse(content));
      const updatedLayout = layoutSchema.parse({
        ...existingLayout,
        ...updatedData,
        updatedAt: Date.now(),
      });
      fs.writeFileSync(
        filePath,
        JSON.stringify(updatedLayout, null, 2),
        "utf-8",
      );
      return { success: true };
    } catch (error) {
      console.error("Error modifying layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public static deleteLayout(fileName: string): IResponse {
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

  public static addOverlay(
    layoutFileName: string,
    overlayFolderName: string,
  ): IResponse {
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

      const content = fs.readFileSync(layoutFilePath, "utf-8");
      const existingLayout = layoutSchema.parse(JSON.parse(content));

      const newOverlay: z.infer<typeof overlaySchema> = {
        id: crypto.randomUUID(),
        name: overlayManifest.name || overlayFolderName,
        folderName: overlayFolderName,
        settings: [],
        isVisible: true,
        isDraggable: true,
        isResizable: true,
        position: {
          width: overlayManifest.defaultWindowWidth || 320,
          height: overlayManifest.defaultWindowHeight || 180,
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

      fs.writeFileSync(
        layoutFilePath,
        JSON.stringify(updatedLayout, null, 2),
        "utf-8",
      );

      return { success: true };
    } catch (error) {
      console.error("Error adding overlay:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public static removeOverlay(layoutFileName: string, overlayId: string) {
    this.setup();

    try {
      const layoutFilePath = `${LAYOUTS_PATH}/${layoutFileName}`;
      if (!fs.existsSync(layoutFilePath)) {
        throw new Error("Layout file does not exist");
      }

      const content = fs.readFileSync(layoutFilePath, "utf-8");
      const existingLayout = layoutSchema.parse(JSON.parse(content));

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

      fs.writeFileSync(
        layoutFilePath,
        JSON.stringify(updatedLayout, null, 2),
        "utf-8",
      );

      return { success: true };
    } catch (error) {
      console.error("Error removing overlay:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public static setActiveLayout(layoutFileName: string): IResponse {
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
        fs.writeFileSync(
          filePath,
          JSON.stringify(updatedLayout, null, 2),
          "utf-8",
        );
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

export {
  ICreateNewLayoutResponse,
  IResponse,
  IModifyLayoutResponse,
  LayoutHandler,
};
