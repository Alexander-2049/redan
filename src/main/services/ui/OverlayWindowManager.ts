import { BrowserWindow } from "electron";
import { ILayoutOverlaySetting } from "../layoutService/schemas/overlaySchema";
import { IOverlayManifest } from "../overlayService/schemas/overlayManifest";
import OverlayHandler from "../overlayService/overlayHandler";
import { LayoutHandler } from "../layoutService/layoutHandler";
import { ILayoutDataAndFilename } from "../layoutService/schemas/layoutSchema";
import { OVERLAY_SERVER_PORT } from "@/shared/shared-constants";
import { createOverlayWindow } from "@/main/utils/createOverlayWindow";
import gameDataHandler from "../game-data";
import { logger } from "@/main/logger";

export interface IOverlayWindow {
  overlayId: string;
  settings: ILayoutOverlaySetting[];
  manifest: IOverlayManifest;
  window: BrowserWindow;
}

export class OverlayWindowManager {
  private windows: IOverlayWindow[] = [];
  private layouts: ILayoutDataAndFilename[] = [];
  private _isLocked = false;

  public isLocked() {
    return this._isLocked;
  }

  public lock() {
    this._isLocked = true;
    logger.info("Overlay windows locked (ignoring mouse events)");
    this.windows.forEach((w) => {
      w.window.setIgnoreMouseEvents(true);
    });

    return true;
  }

  public unlock() {
    this._isLocked = false;
    logger.info("Overlay windows unlocked (accepting mouse events)");
    this.windows.forEach((w) => {
      w.window.setIgnoreMouseEvents(false);
    });

    return false;
  }

  private getOverlayManifest(folderName: string): IOverlayManifest | null {
    const overlayManifest = OverlayHandler.loadOverlayManifest(folderName);
    if (!overlayManifest) {
      logger.warn(`No manifest found for overlay folder: ${folderName}`);
      return null;
    }

    return overlayManifest;
  }

  private updateLayouts() {
    const response = LayoutHandler.getAllLayouts();
    if (response.success && response.layouts) {
      this.layouts = response.layouts;
      logger.info("Layouts updated successfully.");
    } else {
      logger.error("Failed to update layouts:", response.error);
    }
  }

  private getActiveLayout(): ILayoutDataAndFilename | null {
    const activeLayouts = this.layouts.filter(
      (layout) => layout.data.active === true,
    );
    if (!activeLayouts || activeLayouts.length < 1) {
      logger.warn("No active layout found.");
      return null;
    }
    const activeLayout = activeLayouts[0];
    logger.info(`Active layout: ${activeLayout.filename}`);
    return activeLayout;
  }

  private settingsChanged(
    oldSettings: ILayoutOverlaySetting[],
    newSettings: ILayoutOverlaySetting[],
  ): boolean {
    if (oldSettings.length !== newSettings.length) return true;

    for (let i = 0; i < oldSettings.length; i++) {
      const oldSetting = oldSettings[i];
      const newSetting = newSettings.find((s) => s.id === oldSetting.id);
      if (!newSetting || oldSetting.value !== newSetting.value) return true;
    }

    return false;
  }

  private closeOverlayWindow(w: IOverlayWindow) {
    logger.info(`Closing overlay window: ${w.overlayId}`);
    this.windows = this.windows.filter((e) => e.overlayId !== w.overlayId);
    w.window.removeAllListeners();
    w.window.close();
  }

  private attachOverlayWindowListeners(w: IOverlayWindow) {
    const activeLayout = this.getActiveLayout();
    if (!activeLayout) {
      logger.warn(`Cannot attach listeners: no active layout`);
      return;
    }

    const overlayId = w.overlayId;
    const window = w.window;
    logger.info(`Attaching listeners to overlay window: ${overlayId}`);

    const updateOverlayPositionAndSize = () => {
      const bounds = window.getBounds();
      const overlayIndex = activeLayout.data.overlays.findIndex(
        (overlay) => overlay.id === overlayId,
      );

      if (overlayIndex !== -1) {
        activeLayout.data.overlays[overlayIndex].position = {
          width: bounds.width,
          height: bounds.height,
          x: bounds.x,
          y: bounds.y,
        };

        LayoutHandler.modifyLayout(activeLayout.filename, {
          ...activeLayout.data,
          overlays: [...activeLayout.data.overlays],
        });

        logger.info(`Overlay "${overlayId}" position updated:`, bounds);
      }
    };

    window.on("resized", updateOverlayPositionAndSize);
    window.on("moved", updateOverlayPositionAndSize);

    window.on("focus", () => {
      if (this.isLocked()) return;
      window.webContents.send("show-borders");
    });

    window.on("blur", () => {
      window.webContents.send("hide-borders");
    });
  }

  public closeAllOverlays() {
    logger.info("Closing all overlay windows.");
    this.windows.forEach((o) => this.closeOverlayWindow(o));
  }

  public updateOverlayWindows() {
    const previousLayoutFilename = this.getActiveLayout()?.filename;

    this.updateLayouts();

    const newActiveLayout = this.getActiveLayout();

    if (!newActiveLayout) {
      logger.warn("No active layout found after update. Closing all overlays.");
      this.closeAllOverlays();
      return;
    }

    if (!gameDataHandler.isConnected) {
      logger.warn("Game is not connected. Closing all overlays.");
      this.closeAllOverlays();
      return;
    }

    const isLayoutChanged =
      this.windows.length > 0 &&
      newActiveLayout.filename !== previousLayoutFilename;

    if (isLayoutChanged) {
      logger.info(
        `Active layout changed: ${previousLayoutFilename} → ${newActiveLayout.filename}`,
      );
      this.windows.forEach((w) => this.closeOverlayWindow(w));
      this.windows = [];
    }

    const newOverlayIds = newActiveLayout.data.overlays.map((o) => o.id);
    const removedWindows = this.windows.filter(
      (w) => !newOverlayIds.includes(w.overlayId),
    );
    removedWindows.forEach((w) => {
      logger.info(
        `Overlay "${w.overlayId}" removed from layout, closing window.`,
      );
      this.closeOverlayWindow(w);
    });

    this.windows = this.windows.filter((w) =>
      newOverlayIds.includes(w.overlayId),
    );

    newActiveLayout.data.overlays.forEach((updatedOverlay) => {
      const existingWindow = this.windows.find(
        (w) => w.overlayId === updatedOverlay.id,
      );

      const queryParams = updatedOverlay.settings
        .map(
          (setting) =>
            `${encodeURIComponent(setting.id)}=${encodeURIComponent(setting.value)}`,
        )
        .join("&");

      const url = `http://localhost:${OVERLAY_SERVER_PORT}/${updatedOverlay.folderName}${
        queryParams.length > 0 ? "?" + queryParams : ""
      }`;

      if (existingWindow && !updatedOverlay.visible) {
        logger.info(
          `Overlay "${updatedOverlay.id}" set to invisible. Closing window.`,
        );
        this.closeOverlayWindow(existingWindow);
        return;
      }

      if (
        existingWindow &&
        this.settingsChanged(existingWindow.settings, updatedOverlay.settings)
      ) {
        logger.info(
          `Overlay "${updatedOverlay.id}" settings changed. Reloading URL.`,
        );
        existingWindow.window.loadURL(url);
        existingWindow.settings = updatedOverlay.settings;
        return;
      }

      if (!existingWindow && updatedOverlay.visible) {
        const manifest = this.getOverlayManifest(updatedOverlay.folderName);
        if (!manifest) {
          logger.warn(
            `Cannot create window: manifest not found for "${updatedOverlay.folderName}"`,
          );
          return;
        }

        const { minWidth, minHeight, maxWidth, maxHeight } = manifest;
        logger.info(`Creating overlay window: ${updatedOverlay.id}`);

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

        if (this.isLocked()) {
          logger.info(
            `Reapplying lock for new overlay "${updatedOverlay.id}".`,
          );
          this.lock();
        }
      }
    });
  }
}
