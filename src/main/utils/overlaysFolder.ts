import { OVERLAYS_PATH } from "../constants";
import fs from "fs";
import path from "path";
import { overlaySettingsSchema } from "../../shared/schemas/settingsFileSchema";
import { z } from "zod";

export type OverlaySettings = z.infer<typeof overlaySettingsSchema>;

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
    fs.statSync(path.join(OVERLAYS_PATH, item)).isDirectory(),
  );
};
