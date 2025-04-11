import { BrowserWindow } from "electron";
import path from "path";
import { OVERLAYS_PATH } from "../main-constants";
import { createOverlayWindow } from "../utils/createOverlayWindow";
import OverlayHandler from "./overlay/OverlayHandler";

export const setupOverlays = (windows: BrowserWindow[]) => {
  OverlayHandler.setup();

  const modFolders = OverlayHandler.getAll();
  for (const mod of modFolders) {
    const overlayWindow = createOverlayWindow(
      path.join(OVERLAYS_PATH, mod.folderName, "index.html"),
      { width: 500, height: 200 },
    );
    windows.push(overlayWindow);
  }
};
