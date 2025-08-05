import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';

import { LoggerService } from '@/main/features/logger/LoggerService';
import { OverlaySettingInLayout } from '@/main/shared/types/LayoutOverlaySetting';
import { OverlayManifestFile } from '@/main/shared/types/OverlayManifestFile';
import { OverlayWindowBounds } from '@/main/shared/types/OverlayWindowDimentions';

declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export class Overlay {
  private readonly logger = LoggerService.getLogger('overlay');

  private _window: BrowserWindow;
  private _settings: OverlaySettingInLayout[] = [];
  private _baseUrl: string;
  private _manifest: OverlayManifestFile;
  private _isEditMode = false;
  private _id: string;
  private _isPreviewMode = false;
  private _visible = false;

  private readonly _ipcEditModeChannel: string;

  constructor(
    id: string,
    baseUrl: string,
    manifest: OverlayManifestFile,
    bounds: OverlayWindowBounds,
    visible: boolean,
  ) {
    this._id = id;
    this._baseUrl = baseUrl;
    this._manifest = manifest;
    this._visible = visible;

    this._ipcEditModeChannel = `edit-mode-${this._id}`;

    this._window = new BrowserWindow({
      show: false,
      frame: false,
      transparent: true,
      alwaysOnTop: true,
      hasShadow: false,
      minimizable: false,
      fullscreenable: false,
      skipTaskbar: true,
      resizable: false,
      webPreferences: {
        preload: OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY,
        contextIsolation: true,
        nodeIntegration: false,
        sandbox: false,
        webSecurity: true,
        devTools: false,
        additionalArguments: [`--edit-mode-channel=${this._ipcEditModeChannel}`],
      },
      minHeight: bounds.minHeight,
      minWidth: bounds.minWidth,
      maxHeight: bounds.maxHeight,
      maxWidth: bounds.maxWidth,
      x: bounds.x,
      y: bounds.y,
    });

    this._window.setAlwaysOnTop(true, 'screen-saver');
    this._window.setVisibleOnAllWorkspaces(true);
    this._window.setFullScreenable(false);

    this._window.on('minimize', () => {
      this._window.restore();
    });

    this._window.on('system-context-menu', event => {
      event.preventDefault();
    });

    this._window.on('close', event => {
      event.preventDefault();
    });

    this._window.webContents.setWindowOpenHandler(() => {
      return { action: 'deny' };
    });

    // Register unique IPC handler
    ipcMain.handle(this._ipcEditModeChannel, (_event: IpcMainInvokeEvent) => {
      return this._isEditMode;
    });

    // Cleanup on close
    this._window.on('closed', () => {
      ipcMain.removeHandler(this._ipcEditModeChannel);
    });

    this._window.setIgnoreMouseEvents(true);
  }

  public load() {
    let queryParams = this.convertSettingsToQuery(this._settings);
    if (this._isPreviewMode) {
      queryParams = queryParams.length > 0 ? `${queryParams}&preview=true` : 'preview=true';
    }
    const url = `${this._baseUrl}?${queryParams}`;

    const currentUrl = this._window.webContents.getURL();
    if (currentUrl !== url) {
      this._window
        .loadURL(url)
        .then(() => {
          this._window.showInactive();
        })
        .catch(e => {
          this.logger.error(e);
        });
    }
  }

  public updateSettings(newSettings: OverlaySettingInLayout[]) {
    const changed = JSON.stringify(this._settings) !== JSON.stringify(newSettings);
    if (!changed) return;

    this._settings = newSettings;
    this.load();
  }

  public updateEditMode(isEditMode: boolean) {
    this._isEditMode = isEditMode;
    this._window.resizable = isEditMode;
    this._window.setIgnoreMouseEvents(!isEditMode);
    this._window.webContents.send('edit-mode', isEditMode);
  }

  public updatePreviewMode(isPreviewMode: boolean) {
    if (this._isPreviewMode === isPreviewMode) return;
    this._isPreviewMode = isPreviewMode;
    this.load();
  }

  public setVisibile(visible: boolean, updateImmediately: boolean) {
    if (visible === this._visible) return;
    this._visible = visible;
    if (updateImmediately && this._visible) {
      this.show();
    }
    if (updateImmediately && !this._visible) {
      this.hide();
    }
  }

  public show() {
    if (this.visible) {
      this.logger.debug(`Showing ${this._manifest.title} [${this._id}] at ${this.baseUrl}`);

      this._window
        .loadURL(this._baseUrl)
        .then(() => {
          this._window.show();
        })
        .catch(() => {
          this.logger.error('show(): An error occured trying to load ' + this._baseUrl);
        });
    }
  }

  public hide() {
    this._window.hide();
  }

  public destroy() {
    this._window.destroy();
    ipcMain.removeHandler(this._ipcEditModeChannel);
  }

  public on(
    event: 'change-dimensions',
    callback: (position: { x: number; y: number }, size: { width: number; height: number }) => void,
  ) {
    if (event !== 'change-dimensions') return;

    const handler = () => {
      const { x, y, width, height } = this._window.getBounds();
      callback({ x, y }, { width, height });
    };

    this._window.on('resize', handler);
    this._window.on('move', handler);
  }

  public removeListener(event: 'change-dimensions') {
    if (event === 'change-dimensions') {
      this._window.removeAllListeners('resize');
      this._window.removeAllListeners('move');
    }
  }

  public getWindowBounds(): OverlayWindowBounds {
    const { x, y, width, height } = this._window.getBounds();
    return {
      x,
      y,
      width,
      height,
      maxWidth: this._window.getMaximumSize()[0],
      maxHeight: this._window.getMaximumSize()[1],
      minWidth: this._window.getMinimumSize()[0],
      minHeight: this._window.getMinimumSize()[1],
    };
  }

  public updateWindowBounds(bounds: Partial<OverlayWindowBounds>) {
    const { x, y, width, height, minWidth, minHeight, maxWidth, maxHeight } = {
      ...this.getWindowBounds(),
      ...bounds,
    };

    this._window.setBounds({
      width,
      height,
      x,
      y,
    });

    if (typeof minWidth === 'number' && typeof minHeight === 'number') {
      this._window.setMinimumSize(minWidth, minHeight);
    }
    if (typeof maxWidth === 'number' && typeof maxHeight === 'number') {
      this._window.setMaximumSize(maxWidth, maxHeight);
    }
  }

  public isEditMode() {
    return this._isEditMode;
  }

  public isPreviewMode() {
    return this._isPreviewMode;
  }

  public get id() {
    return this._id;
  }

  public get settings() {
    return this._settings;
  }

  public get manifest() {
    return this._manifest;
  }

  public get baseUrl(): string {
    return this._baseUrl;
  }

  public get visible() {
    return this._visible;
  }

  public convertSettingsToQuery(settings: OverlaySettingInLayout[]): string {
    return settings
      .map(setting =>
        Object.entries(setting)
          .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
          .join('&'),
      )
      .join('&');
  }
}
