import { createOverlayWindow } from "../../utils/createOverlayWindow";
import OverlayHandler from "../overlayService/overlayHandler";
import { ILayoutResponse, LayoutHandler } from "../layoutService/layoutHandler";
import { IOverlayWindow } from "./windowManager";
import { ILayoutDataAndFilename } from "../layoutService/schemas/layoutSchema";
import { OVERLAY_SERVER_PORT } from "@/shared/shared-constants";
import { ILayoutOverlaySetting } from "../layoutService/schemas/overlaySchema";
import { BrowserWindow } from "electron";

export const updateOverlayWindows = (windows: IOverlayWindow[]) => {
  OverlayHandler.createOverlaysFolder();

  const layouts = LayoutHandler.getAllLayouts();
  const activeLayout = getActiveLayout(layouts);
  if (!activeLayout) return;

  const overlays = activeLayout.data.overlays;

  // Track overlays that are still active
  const activeOverlayIds = new Set(overlays.map((overlay) => overlay.id));

  // Close and remove windows for overlays that no longer exist
  for (let i = windows.length - 1; i >= 0; i--) {
    const overlayWindow = windows[i];
    if (!activeOverlayIds.has(overlayWindow.overlayId)) {
      overlayWindow.window.removeAllListeners("close");
      overlayWindow.window.close();
      windows.splice(i, 1);
    }
  }

  // Update or create new overlay windows
  for (const overlay of overlays) {
    const existingWindow = windows.find((w) => w.overlayId === overlay.id);

    const queryParams = overlay.settings
      .map(
        (setting) =>
          `${encodeURIComponent(setting.id)}=${encodeURIComponent(setting.value)}`,
      )
      .join("&");
    const url = `http://localhost:${OVERLAY_SERVER_PORT}/${overlay.folderName}${queryParams.length > 0 ? "?" : ""}${queryParams}`;

    if (existingWindow) {
      // Check if settings have changed
      const settingsChanged = haveSettingsChanged(
        existingWindow.overlaySettings,
        overlay.settings,
      );

      if (settingsChanged) {
        existingWindow.window.loadURL(url);
        existingWindow.overlaySettings = overlay.settings;
      }

      // Attach event listeners to track position and size changes
      attachWindowListeners(existingWindow.window, overlay.id, activeLayout);
    } else {
      // Create a new overlay window
      const overlayWindow = createOverlayWindow(url, {
        width: overlay.position.width,
        height: overlay.position.height,
        x: overlay.position.x,
        y: overlay.position.y,
        resizable: overlay.isResizable,
      });

      // Attach event listeners to track position and size changes
      attachWindowListeners(overlayWindow, overlay.id, activeLayout);

      windows.push({
        overlayId: overlay.id,
        window: overlayWindow,
        overlaySettings: overlay.settings,
      });
    }
  }
};

function attachWindowListeners(
  window: BrowserWindow,
  overlayId: string,
  activeLayout: ILayoutDataAndFilename,
) {
  const updateOverlayPositionAndSize = () => {
    const bounds = window.getBounds(); // Get the current position and size
    const overlayIndex = activeLayout.data.overlays.findIndex(
      (overlay) => overlay.id === overlayId,
    );

    if (overlayIndex !== -1) {
      // Update the overlay's position and size in the layout
      activeLayout.data.overlays[overlayIndex].position = {
        width: bounds.width,
        height: bounds.height,
        x: bounds.x,
        y: bounds.y,
      };

      // Save the updated layout to the file
      LayoutHandler.modifyLayout(activeLayout.filename, {
        ...activeLayout.data,
        overlays: [...activeLayout.data.overlays],
      });
    }
  };

  // Listen for resize and move events
  window.on("resized", updateOverlayPositionAndSize);
  window.on("moved", updateOverlayPositionAndSize);
}

function haveSettingsChanged(
  oldSettings: ILayoutOverlaySetting[],
  newSettings: ILayoutOverlaySetting[],
): boolean {
  if (oldSettings.length !== newSettings.length) {
    return true;
  }

  for (let i = 0; i < oldSettings.length; i++) {
    const oldSetting = oldSettings[i];
    const newSetting = newSettings.find((s) => s.id === oldSetting.id);

    if (!newSetting || oldSetting.value !== newSetting.value) {
      return true;
    }
  }

  return false;
}

function getActiveLayout(
  layouts: ILayoutResponse,
): ILayoutDataAndFilename | null {
  const activeLayouts = layouts.layouts?.filter(
    (layout) => layout.data.active === true,
  );
  if (!activeLayouts || activeLayouts.length < 1) return null;
  const activeLayout = activeLayouts[0];
  return activeLayout;
}
