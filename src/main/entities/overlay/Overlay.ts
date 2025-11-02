import { BrowserWindow, ipcMain, IpcMainInvokeEvent } from 'electron';

import { LoggerService } from '@/main/features/logger/LoggerService';
import { OverlaySettingInLayout } from '@/main/shared/types/LayoutOverlaySetting';
import { OverlayManifestFile } from '@/main/shared/types/OverlayManifestFile';
import { OverlayWindowBounds } from '@/main/shared/types/OverlayWindowDimentions';

declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

/*
  Overlay initializes outside of screen view with x: -9999999
  
*/
export class Overlay {
  private readonly logger = LoggerService.getLogger('overlay');

  private _window: BrowserWindow;
  private _settings: OverlaySettingInLayout[] = [];
  private _isEditMode = false;
  private _isPreviewMode = false;
  private _visible = false;

  private readonly _ipcEditModeChannel: string;
  private params: {
    id: string;
    baseUrl: string;
    manifest: OverlayManifestFile;
    bounds: OverlayWindowBounds;
    visible: boolean;
  };
  private readonly browserWindowParams;

  constructor(
    id: string,
    baseUrl: string,
    manifest: OverlayManifestFile,
    bounds: OverlayWindowBounds,
    visible: boolean,
    settings: OverlaySettingInLayout[] = this._settings,
  ) {
    this.params = {
      id,
      baseUrl,
      manifest,
      bounds,
      visible,
    };
    this._ipcEditModeChannel = `edit-mode-${this.params.id}`;
    this._settings = settings;

    this.browserWindowParams = {
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
      minHeight: this.params.bounds.minHeight,
      minWidth: this.params.bounds.minWidth,
      maxHeight: this.params.bounds.maxHeight,
      maxWidth: this.params.bounds.maxWidth,
      x: -9999999,
      y: 0,
    };

    this._window = new BrowserWindow(this.browserWindowParams);

    this.init();
  }

  private init() {
    if (this._window.isDestroyed()) this._window = new BrowserWindow(this.browserWindowParams);

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
      if (!this._window.isClosable()) event.preventDefault();
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
    if (this._window.isDestroyed()) this.init();

    let queryParams = this.convertSettingsToQuery(this._settings);
    if (this._isPreviewMode) {
      queryParams = queryParams.length > 0 ? `${queryParams}&preview=true` : 'preview=true';
    }
    const url = `${this.params.baseUrl}?${queryParams}`;

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

  public setEditMode(isEditMode: boolean) {
    if (this._window.isDestroyed()) this.init();

    this._isEditMode = isEditMode;
    this._window.resizable = isEditMode;
    this._window.setIgnoreMouseEvents(!isEditMode);
    this._window.webContents.send('edit-mode', isEditMode);
  }

  public setPreviewMode(isPreviewMode: boolean) {
    if (this._window.isDestroyed()) this.init();

    if (this._isPreviewMode === isPreviewMode) return;
    this._isPreviewMode = isPreviewMode;
    this.load();
  }

  public setVisibile(visible: boolean, updateImmediately: boolean) {
    if (this._window.isDestroyed()) this.init();

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
    if (this._window.isDestroyed()) this.init();

    this._window.closable = false;
    if (this.visible) {
      let queryParams = this.convertSettingsToQuery(this._settings);
      if (this._isPreviewMode) {
        queryParams = queryParams.length > 0 ? `${queryParams}&preview=true` : 'preview=true';
      }
      const url = `${this.params.baseUrl}?${queryParams}`;

      this.logger.debug(`Showing ${this.params.manifest.title} [${this.params.id}] at ${url}`);

      this._window
        .loadURL(url)
        .then(() => {
          this._window.show();
          this.updateWindowBounds({
            ...this.params.bounds,
          });
        })
        .catch(() => {
          this.logger.error('show(): An error occured trying to load ' + this.params.baseUrl);
        });
    }
  }

  public hide() {
    if (this._window.isDestroyed()) this.init();

    this._window.hide();
  }

  public close() {
    if (this._window.isDestroyed()) this.init();

    const { x, y, width, height } = this._window.getBounds();

    this.params.bounds = {
      ...this.params.bounds,
      height,
      width,
      x,
      y,
    };

    this._window.closable = true;
    this._window.close();
  }

  public destroy() {
    if (this._window.isDestroyed()) this.init();

    const { x, y, width, height } = this._window.getBounds();

    this.params.bounds = {
      ...this.params.bounds,
      height,
      width,
      x,
      y,
    };

    this._window.destroy();
    this.removeListener('change-dimensions');
    ipcMain.removeHandler(this._ipcEditModeChannel);
  }

  public removeListener(event: 'change-dimensions') {
    if (this._window.isDestroyed()) this.init();

    if (event === 'change-dimensions') {
      this._window.removeAllListeners('resize');
      this._window.removeAllListeners('move');
    }
  }

  public getWindowBounds(): OverlayWindowBounds {
    if (this._window.isDestroyed())
      return {
        ...this.params.bounds,
      };

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
    if (this._window.isDestroyed()) this.init();

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

    // if (typeof minWidth === 'number' && typeof minHeight === 'number') {
    //   this._window.setMinimumSize(minWidth, minHeight);
    // }
    // if (typeof maxWidth === 'number' && typeof maxHeight === 'number') {
    //   this._window.setMaximumSize(maxWidth, maxHeight);
    // }
  }

  public isEditMode() {
    return this._isEditMode;
  }

  public isPreviewMode() {
    return this._isPreviewMode;
  }

  public get id() {
    return this.params.id;
  }

  public get settings() {
    return this._settings;
  }

  public get manifest() {
    return this.params.manifest;
  }

  public get baseUrl(): string {
    return this.params.baseUrl;
  }

  public get visible() {
    return this.params.visible;
  }

  public convertSettingsToQuery(settings: OverlaySettingInLayout[]): string {
    return settings
      .map(setting => {
        let value = '';
        if (typeof setting.value === 'string') {
          value = setting.value;
        }
        if (typeof setting.value === 'boolean') {
          value = setting.value ? 'true' : 'false';
        }
        if (typeof setting.value === 'number') {
          value = `${setting.value}`;
        }
        if (Array.isArray(setting.value)) {
          value = setting.value.join(',');
        }

        return `${encodeURIComponent(setting.id)}=${encodeURIComponent(value)}`;
      })
      .join('&');
  }
}
