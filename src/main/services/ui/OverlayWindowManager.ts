import { BrowserWindow } from "electron";
import { ILayoutOverlaySetting } from "../layoutService/schemas/overlaySchema";
import { IOverlayManifest } from "../overlayService/schemas/overlayManifest";
import OverlayHandler from "../overlayService/overlayHandler";
import { LayoutHandler } from "../layoutService/layoutHandler";
import { ILayoutDataAndFilename } from "../layoutService/schemas/layoutSchema";
import { OVERLAY_SERVER_PORT } from "@/shared/shared-constants";
import { createOverlayWindow } from "@/main/utils/createOverlayWindow";
// import gameDataHandler from "../game-data";

export interface IOverlayWindow {
  overlayId: string;
  settings: ILayoutOverlaySetting[];
  manifest: IOverlayManifest;
  window: BrowserWindow;
}

export class OverlayWindowManager {
  private windows: IOverlayWindow[] = [];
  private layouts: ILayoutDataAndFilename[] = [];

  private getOverlayManifest(folderName: string): IOverlayManifest | null {
    console.log(`Getting overlay manifest for folder: ${folderName}`);
    const overlayManifest = OverlayHandler.loadOverlayManifest(folderName);
    if (!overlayManifest) {
      console.warn(`No manifest found for folder: ${folderName}`);
      return null;
    }
    console.log(`Manifest loaded for folder: ${folderName}`);
    return overlayManifest;
  }

  private updateLayouts() {
    console.log("Updating layouts...");
    const response = LayoutHandler.getAllLayouts();
    if (response.success && response.layouts) {
      console.log(`Successfully received ${response.layouts.length} layouts.`);
      this.layouts = response.layouts;
    } else {
      console.error("Failed to update layouts:", response.error);
    }
  }

  private getActiveLayout(): ILayoutDataAndFilename | null {
    console.log("Searching for active layout...");
    const activeLayouts = this.layouts.filter(
      (layout) => layout.data.active === true,
    );
    if (!activeLayouts || activeLayouts.length < 1) {
      console.warn("No active layout found.");
      return null;
    }
    const activeLayout = activeLayouts[0];
    console.log(`Active layout found: ${activeLayout.filename}`);
    return activeLayout;
  }

  private settingsChanged(
    oldSettings: ILayoutOverlaySetting[],
    newSettings: ILayoutOverlaySetting[],
  ): boolean {
    console.log("Comparing overlay settings...");
    if (oldSettings.length !== newSettings.length) {
      console.log("Settings length changed.");
      return true;
    }

    for (let i = 0; i < oldSettings.length; i++) {
      const oldSetting = oldSettings[i];
      const newSetting = newSettings.find((s) => s.id === oldSetting.id);

      if (!newSetting) {
        console.log(
          `Setting with id ${oldSetting.id} not found in new settings.`,
        );
        return true;
      }
      if (oldSetting.value !== newSetting.value) {
        console.log(
          `Setting value changed for id ${oldSetting.id}: ${oldSetting.value} -> ${newSetting.value}`,
        );
        return true;
      }
    }

    console.log("Settings have not changed.");
    return false;
  }

  private closeOverlayWindow(w: IOverlayWindow) {
    console.log(`Closing overlay window: ${w.overlayId}`);
    console.log(`Windows before close: ${this.windows.length}`);
    this.windows = this.windows.filter((e) => e.overlayId !== w.overlayId);
    w.window.removeAllListeners();
    w.window.close();
    console.log(`Windows after close: ${this.windows.length}`);
  }

  private attachOverlayWindowListeners(w: IOverlayWindow) {
    const activeLayout = this.getActiveLayout();
    if (!activeLayout) return;
    const overlayId = w.overlayId;
    const window = w.window;

    // const overlay = activeLayout.data.overlays.find(
    //   (overlay) => overlay.id === overlayId,
    // );

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

    window.on("focus", () => {
      window.webContents.send("show-borders");
    });
    window.on("blur", () => {
      window.webContents.send("hide-borders");
    });

    // window.hide();
    // gameDataHandler.addListener("data", (data) => {
    //   if (overlay?.visible && !data.isConnected && window.isVisible()) {
    //     window.hide();
    //   }
    //   if (overlay?.visible && data.isConnected && !window.isVisible()) {
    //     window.show();
    //   }
    // });
  }

  public closeAllOverlays() {
    this.windows.forEach((o) => {
      this.closeOverlayWindow(o);
    });
  }

  public updateOverlays() {
    console.log("Updating overlays...");
    const previousLayoutFilename = this.getActiveLayout()?.filename;

    this.updateLayouts();

    const newActiveLayout = this.getActiveLayout();

    if (!newActiveLayout) {
      console.log("No active layout, closing all overlays...");
      this.windows.forEach((w) => this.closeOverlayWindow(w));
      return;
    }

    const isLayoutChanged =
      this.windows.length > 0 &&
      newActiveLayout.filename !== previousLayoutFilename;

    if (isLayoutChanged) {
      console.log("Active layout has changed. Recreating all overlays.");
      this.windows.forEach((w) => this.closeOverlayWindow(w));
      this.windows = [];
    }

    const newOverlayIds = newActiveLayout.data.overlays.map((o) => o.id);
    const removedWindows = this.windows.filter(
      (w) => !newOverlayIds.includes(w.overlayId),
    );
    removedWindows.forEach((w) => {
      console.log(`Overlay ${w.overlayId} was removed from layout. Closing.`);
      this.closeOverlayWindow(w);
    });

    // Update windows list after removal
    this.windows = this.windows.filter((w) =>
      newOverlayIds.includes(w.overlayId),
    );

    console.log(`Updating overlays for layout: ${newActiveLayout.filename}`);

    newActiveLayout.data.overlays.forEach((updatedOverlay) => {
      console.log(`Processing overlay: ${updatedOverlay.id}`);

      const existingWindow = this.windows.find(
        (w) => w.overlayId === updatedOverlay.id,
      );

      const queryParams = updatedOverlay.settings
        .map(
          (setting) =>
            `${encodeURIComponent(setting.id)}=${encodeURIComponent(setting.value)}`,
        )
        .join("&");

      const url = `http://localhost:${OVERLAY_SERVER_PORT}/${updatedOverlay.folderName}${queryParams.length > 0 ? "?" : ""}${queryParams}`;
      console.log(`Generated URL for overlay ${updatedOverlay.id}: ${url}`);

      if (existingWindow && !updatedOverlay.visible) {
        console.log(
          `Overlay ${updatedOverlay.id} is no longer visible. Closing window.`,
        );
        this.closeOverlayWindow(existingWindow);
        return;
      }

      if (
        existingWindow &&
        this.settingsChanged(existingWindow.settings, updatedOverlay.settings)
      ) {
        console.log(
          `Overlay ${updatedOverlay.id} settings changed. Reloading window.`,
        );
        existingWindow.window.loadURL(url);
        existingWindow.settings = updatedOverlay.settings;
        return;
      }

      if (!existingWindow && updatedOverlay.visible) {
        console.log(`Creating new window for overlay ${updatedOverlay.id}`);
        const manifest = this.getOverlayManifest(updatedOverlay.folderName);
        if (!manifest) {
          console.warn(
            `Cannot create window, manifest not found for ${updatedOverlay.folderName}`,
          );
          return;
        }

        const { minWidth, minHeight, maxWidth, maxHeight } = manifest;
        const overlayWindow = createOverlayWindow(url, {
          width: updatedOverlay.position.width,
          height: updatedOverlay.position.height,
          x: updatedOverlay.position.x,
          y: updatedOverlay.position.y,
          minWidth,
          minHeight,
          maxWidth,
          maxHeight,
        });

        const overlayDetails = {
          manifest,
          overlayId: updatedOverlay.id,
          settings: updatedOverlay.settings,
          window: overlayWindow,
        };
        this.attachOverlayWindowListeners(overlayDetails);

        this.windows.push(overlayDetails);

        console.log(
          `Window for overlay ${updatedOverlay.id} created and stored.`,
        );
      }
    });

    console.log("Overlay update process complete.");
  }
}
