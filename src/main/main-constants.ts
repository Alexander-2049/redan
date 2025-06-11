import { app } from "electron";
import path from "path";

export const IS_DEV = process.env.NODE_ENV === "development";

export const RESOURCES_PATH = IS_DEV
  ? path.join(__dirname, "../../", "assets")
  : path.join(process.resourcesPath);

export const OVERLAYS_PATH = path.join(app.getPath("userData"), "Overlays");
export const LAYOUTS_PATH = path.join(app.getPath("userData"), "Layouts");
export const REPLAYS_PATH = path.join(app.getPath("userData"), "Replays");
export const CACHE_PATH = path.join(app.getPath("userData"), "Cache");
export const LOGS_PATH = path.join(app.getPath("userData"), "Logs");
