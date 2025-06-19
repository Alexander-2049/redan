import { app } from "electron";
import path from "path";
import { isDev } from "./utils/is-dev";

export const RESOURCES_PATH = isDev()
  ? path.join(__dirname, "../../", "assets")
  : path.join(process.resourcesPath);

export const OVERLAYS_PATH = path.join(app.getPath("userData"), "Overlays");
export const LAYOUTS_PATH = path.join(app.getPath("userData"), "Layouts");
export const REPLAYS_PATH = path.join(app.getPath("userData"), "Replays");
export const CACHE_PATH = path.join(app.getPath("userData"), "Cache");
export const LOGS_PATH = path.join(app.getPath("userData"), "Logs");
export const IS_DEBUG = process.argv.includes("--debug");
