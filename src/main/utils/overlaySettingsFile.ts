import { OVERLAYS_SETTINGS_FILE_PATH } from "../constants";
import fs from "fs";
import { settingsFileSchema } from "../../shared/schemas/settingsFileSchema";
import { z } from "zod";

export type SettingsFile = z.infer<typeof settingsFileSchema>;
const settingsFileTemplate: SettingsFile = {
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
    const result = settingsFileSchema.safeParse(parsedData);
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
