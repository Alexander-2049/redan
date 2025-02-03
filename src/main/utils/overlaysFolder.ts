import { OVERLAYS_PATH } from "../constants";
import fs from "fs";

export const createOverlaysFolder = () => {
  if (!fs.existsSync(OVERLAYS_PATH)) {
    fs.mkdirSync(OVERLAYS_PATH, { recursive: true });
    return true;
  } else {
    return false;
  }
};

export const getOverlayNames = () => {
  return fs.readdirSync(OVERLAYS_PATH);
};
