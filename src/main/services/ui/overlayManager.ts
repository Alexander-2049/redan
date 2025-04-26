import { BrowserWindow } from "electron";
import path from "path";
import { OVERLAYS_PATH } from "../../main-constants";
import { createOverlayWindow } from "../../utils/createOverlayWindow";
import OverlayHandler from "../overlayService/overlayHandler";
import { LayoutHandler } from "../layoutService/layoutHandler";

export const setupOverlays = (windows: BrowserWindow[]) => {
  OverlayHandler.setup();

  const layouts = LayoutHandler.getAllLayouts();
  const activeLayouts = layouts.layouts?.filter(
    (layout) => layout.data.active === true,
  );
  if (!activeLayouts || activeLayouts.length < 1) return;
  const activeLayout = activeLayouts[0];

  const overlayFolders = activeLayout.data.overlays;
  for (const overlay of overlayFolders) {
    const overlayWindow = createOverlayWindow(
      path.join(OVERLAYS_PATH, overlay.folderName, "index.html"),
      {
        width: overlay.position.width,
        height: overlay.position.height,
        x: overlay.position.x,
        y: overlay.position.y,
        resizable: overlay.isResizable,
      },
    );
    windows.push(overlayWindow);
  }
};
