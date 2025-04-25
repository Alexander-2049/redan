import { LAYOUTS_PATH } from "@/main/main-constants";
import fs from "fs";
import {
  layoutSchema,
  ILayout,
  LayoutDataAndFilename,
} from "./schemas/layoutSchema";
import sanitize from "sanitize-filename";
import { overlaySchema } from "./schemas/overlaySchema";
import { z } from "zod";
import OverlayHandler from "../overlayService/overlayHandler";

export interface ICreateNewLayoutResponse {
  success: boolean;
  filePath?: string;
  error?: string;
}

export type IResponse =
  | {
      success: true;
    }
  | {
      success: false;
      error: string;
    };

export interface IModifyLayoutResponse {
  success: boolean;
  error?: string;
}

export class LayoutHandler {
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

  public static getAllLayouts() {
    this.setup();

    try {
      const files = fs.readdirSync(LAYOUTS_PATH);
      const layouts: LayoutDataAndFilename[] = files
        .filter((file) => file.endsWith(".json"))
        .map((file) => {
          const filePath = `${LAYOUTS_PATH}/${file}`;
          const content = fs.readFileSync(filePath, "utf-8");
          return {
            filename: file,
            data: layoutSchema.parse(JSON.parse(content)),
          };
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
      const layoutFilePath = `${LAYOUTS_PATH}/${layoutFileName}.json`;
      if (!fs.existsSync(layoutFilePath)) {
        throw new Error("Layout file does not exist");
      }

      const content = fs.readFileSync(layoutFilePath, "utf-8");
      const existingLayout = layoutSchema.parse(JSON.parse(content));

      const newOverlay: z.infer<typeof overlaySchema> = {
        id: crypto.randomUUID(),
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
}
