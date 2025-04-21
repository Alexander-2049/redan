import { LAYOUTS_PATH } from "@/main/main-constants";
import fs from "fs";
import {
  layoutSchema,
  ILayout,
  LayoutDataAndFilename,
} from "./schemas/layoutSchema";
import sanitize from "sanitize-filename";

export interface ICreateNewLayoutOutput {
  success: boolean;
  filePath?: string;
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
    screenWidth,
    screenHeight,
  }: {
    layoutName: string;
    screenWidth: number;
    screenHeight: number;
  }): ICreateNewLayoutOutput {
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

    const newLayout = {
      name: layoutName,
      description: "",
      overlays: [],
      screenWidth,
      screenHeight,
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

  public static modifyLayout(fileName: string, updatedData: Partial<ILayout>) {
    this.setup();

    try {
      const filePath = `${LAYOUTS_PATH}/${fileName}.json`;
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
      return { success: true, filePath };
    } catch (error) {
      console.error("Error modifying layout:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  public static deleteLayout(fileName: string) {
    this.setup();

    try {
      const filePath = `${LAYOUTS_PATH}/${fileName}.json`;
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
}
