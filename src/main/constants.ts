import { app } from "electron";
import path from "path";

export const IS_DEV = process.env.NODE_ENV === "development";

export const RESOURCES_PATH = IS_DEV
  ? path.join(__dirname, "../../", "assets")
  : path.join(process.resourcesPath);

export const OVERLAYS_PATH = path.join(app.getPath("userData"), "Overlays");
export const OVERLAYS_SETTINGS_FILE_PATH = path.join(
  app.getPath("userData"),
  "Overlays",
  "settings.json"
);
