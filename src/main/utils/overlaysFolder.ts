import { OVERLAYS_PATH, OVERLAYS_SETTINGS_FILE_PATH } from "../constants";
import fs from "fs";
import path from "path";
import {
  OverlaySettingsSchema,
  SettingsFileSchema,
} from "../schemas/SettingsFileSchema";
import { z } from "zod";

export type OverlaySettings = z.infer<typeof OverlaySettingsSchema>;
export type SettingsFile = z.infer<typeof SettingsFileSchema>;

export const createOverlaysFolder = () => {
  if (!fs.existsSync(OVERLAYS_PATH)) {
    fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
    return true;
  } else {
    return false;
  }
};

export const getOverlayNames = () => {
  const dir = fs.readdirSync(OVERLAYS_PATH);
  return dir.filter((item) =>
    fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory()
  );
};

const settingsFileTemplate = {
  version: "1.0",
  overlays: [],
};

export const createOverlaySettingsFile = () => {
  if (!fs.existsSync(OVERLAYS_SETTINGS_FILE_PATH)) {
    fs.writeFileSync(
      OVERLAYS_SETTINGS_FILE_PATH,
      JSON.stringify(settingsFileTemplate, null, 4)
    );
  }
};

export const readOverlaySettingsFile = () => {
  if (!fs.existsSync(OVERLAYS_SETTINGS_FILE_PATH)) {
    createOverlaySettingsFile();
  }

  const fileContent = fs.readFileSync(OVERLAYS_SETTINGS_FILE_PATH, "utf-8");
  try {
    const parsedData = JSON.parse(fileContent);
    const result = SettingsFileSchema.safeParse(parsedData);
    if (!result.success) {
      console.error("Invalid settings file format:", result.error.format());
      return null;
    }
    return result.data;
  } catch (error) {
    console.error("Error reading settings file:", error);
    return null;
  }
};
