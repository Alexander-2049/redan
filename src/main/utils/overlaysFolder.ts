import { OVERLAYS_PATH, OVERLAYS_SETTINGS_FILE_PATH } from "../constants";
import fs from "fs";
import path from "path";

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
  const overlayNames: string[] = [];
  for (let i = 0; i < dir.length; i++) {
    if (fs.statSync(path.join(OVERLAYS_PATH, dir[i])).isDirectory())
      overlayNames.push(dir[i]);
  }
  return overlayNames;
};

export interface OverlaySettingsInterface {
  folderName: string;
  windowWidth: number;
  windowHeight: number;
  windowPositionX: number;
  windowPositionY: number;
  clickThrough: boolean;
  resizable: boolean;
  draggable: boolean;
}

const settingsFileTemplate: {
  version: string;
  overlays: OverlaySettingsInterface[];
} = {
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
