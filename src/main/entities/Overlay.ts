import { BrowserWindow } from 'electron';
import { LayoutOverlay } from '../shared/types/LayoutOverlay';
declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

interface OverlayWindowOptions {
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
    minWidth: number;
    minHeight: number;
    maxWidth: number;
    maxHeight: number;
  };
}

interface OverlayPosition {
  x: number;
  y: number;
}

interface OverlaySize {
  width: number;
  height: number;
}

export class Overlay {
  protected _window: BrowserWindow;
  private _isEditMode = false;
  private _baseUrl: string = '';
  private _queryParameters: string = '';

  constructor(_baseUrl: string, options: OverlayWindowOptions) {
    this._baseUrl = _baseUrl;
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
      },
      ...options,
    });

    this._window.setAlwaysOnTop(true, 'screen-saver');
    this._window.setVisibleOnAllWorkspaces(true); // Ensures it's visible across all workspaces
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
  }

  public load() {
    this._window.loadURL(this._baseUrl).then(() => {
      this._window.showInactive();
    });
  }

  public show() {
    this._window.show();
  }

  public hide() {
    this._window.hide();
  }

  public destroy() {
    this._window.destroy();
  }

  public isEditMode() {
    return this._isEditMode;
  }

  public toggleEditMode(isEditMode: boolean) {
    this._window.resizable = isEditMode;
    this._window.setIgnoreMouseEvents(isEditMode);
    this._window.webContents.send('set-edit-mode', !isEditMode);
    this._isEditMode = isEditMode;
  }

  public on(
    event: 'change-dimentions',
    callback: (position: OverlayPosition, size: OverlaySize) => void,
  ) {
    if (event !== 'change-dimentions') return;

    const sendWindowDimensions = () => {
      const { x, y, width, height } = this._window.getBounds();
      callback(
        {
          x,
          y,
        },
        {
          width,
          height,
        },
      );
    };

    this._window.on('resize', sendWindowDimensions);
    this._window.on('move', sendWindowDimensions);
  }

  public removeListener(event: 'change-dimentions') {
    if (event !== 'change-dimentions') return;
    this._window.removeAllListeners('resize');
    this._window.removeAllListeners('move');
  }

  public get properties(): LayoutOverlay {
    return this.properties;
  }
}
