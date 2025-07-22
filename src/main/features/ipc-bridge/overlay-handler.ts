import fs from 'fs';
import path from 'path';

import { BrowserWindow, ipcMain } from 'electron';

import { LoggerService } from '../logger/LoggerService';
import { OverlayPreviewRouter } from '../overlays/OverlayPreviewRouter';
import { PathService } from '../paths/PathService';

import { Overlay } from '@/main/entities/overlay';
import { OverlaySettingInLayout } from '@/main/shared/types/LayoutOverlaySetting';
import { OverlayManifestFile } from '@/main/shared/types/OverlayManifestFile';
import { OverlayWindowBounds } from '@/main/shared/types/OverlayWindowDimentions';
import { IPC_CHANNELS } from '@/shared/ipc/channels';

const logger = LoggerService.getLogger('ipc-overlay-handlers');

let overlay: Overlay | null = null;

export function registerOverlayHandlers() {
  ipcMain.handle(IPC_CHANNELS.OVERLAY.OPEN, (event, url: string, manifest: OverlayManifestFile) => {
    logger.info(`Opening overlay with URL: ${url}`);

    const bounds: OverlayWindowBounds = {
      x: 200,
      y: 200,
      height: manifest.dimentions.defaultHeight,
      width: manifest.dimentions.defaultWidth,
      ...manifest.dimentions,
    };

    const id = 'overlay-1';
    const visible = true;

    if (overlay) {
      overlay.destroy();
    }

    overlay = new Overlay(id, url, manifest, bounds, visible);
    overlay.load();
  });

  ipcMain.handle(IPC_CHANNELS.OVERLAY.CLOSE, () => {
    logger.info(`Closing overlay`);
    if (overlay) {
      overlay.destroy();
      overlay = null;
    }
  });

  ipcMain.handle(IPC_CHANNELS.OVERLAY.UPDATE_EDIT_MODE, (event, mode: boolean) => {
    logger.info(`Update edit mode: ${mode ? 'true' : 'false'}`);
    if (overlay instanceof Overlay) {
      overlay.updateEditMode(mode);
    }
  });

  ipcMain.handle(
    IPC_CHANNELS.OVERLAY.UPDATE_SETTINGS,
    (event, settings: OverlaySettingInLayout[]) => {
      logger.info(`Update overlay settings: ${JSON.stringify(settings)}`);
      if (overlay instanceof Overlay) {
        overlay.updateSettings(settings);
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.OVERLAY.SERVE_PREVIEW, (event, folderPath: string) => {
    try {
      OverlayPreviewRouter.getInstance().startServing(folderPath);
      return true;
    } catch (error) {
      return false;
    }
  });

  ipcMain.handle(IPC_CHANNELS.OVERLAY.STOP_SERVING_PREVIEW, () => {
    OverlayPreviewRouter.getInstance().stopServing();
  });

  ipcMain.handle(IPC_CHANNELS.OVERLAY.GENERATE_THUMBNAIL, async () => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const iframeURL = 'http://localhost:42049/preview/thumbnail';
    const win = new BrowserWindow({ show: false, width: 200, height: 200, frame: false });
    await win.loadURL(iframeURL);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const image = await win.capturePage();

    const dirPath = path.join(PathService.getPath('CACHE'), 'OverlayPreview');
    fs.mkdirSync(dirPath, { recursive: true });

    const filePath = path.join(dirPath, 'Preview.png');

    fs.writeFileSync(filePath, image.toPNG());

    return filePath;
  });
}
