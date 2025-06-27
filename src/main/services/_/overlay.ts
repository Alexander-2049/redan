import { BrowserWindow } from "electron";
declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

interface OverlayWindowOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  minWidth: number;
  minHeight: number;
  maxWidth: number;
  maxHeight: number;
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
  protected window: BrowserWindow;
  protected _isEditMode = false;

  constructor(options: OverlayWindowOptions) {
    this.window = new BrowserWindow({
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

    this.window.setAlwaysOnTop(true, "screen-saver");
    this.window.setVisibleOnAllWorkspaces(true); // Ensures it's visible across all workspaces
    this.window.setFullScreenable(false);

    this.window.on("minimize", () => {
      this.window.restore();
    });

    this.window.on("system-context-menu", (event) => {
      event.preventDefault();
    });

    this.window.on("close", (event) => {
      event.preventDefault();
    });
  }

  public load(url: string) {
    this.window.loadURL(url).then(() => {
      this.window.showInactive();
    });
  }

  public show() {
    this.window.show();
  }

  public hide() {
    this.window.hide();
  }

  public destroy() {
    this.window.destroy();
  }

  public isEditMode() {
    return this._isEditMode;
  }

  public toggleEditMode(isEditMode: boolean) {
    this.window.resizable = isEditMode;
    this.window.setIgnoreMouseEvents(isEditMode);
    this.window.webContents.send("set-edit-mode", !isEditMode);
    this._isEditMode = isEditMode;
  }

  public on(
    event: "change-dimentions",
    callback: (position: OverlayPosition, size: OverlaySize) => void,
  ) {
    if (event !== "change-dimentions") return;

    const sendWindowDimensions = () => {
      const { x, y, width, height } = this.window.getBounds();
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

    this.window.on("resize", sendWindowDimensions);
    this.window.on("move", sendWindowDimensions);
  }

  public removeListener(event: "change-dimentions") {
    if (event !== "change-dimentions") return;
    this.window.removeAllListeners("resize");
    this.window.removeAllListeners("move");
  }
}
