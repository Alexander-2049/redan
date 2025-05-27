import { BrowserWindow } from "electron";

declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const createOverlayWindow = (
  url: string,
  options?: Electron.BrowserWindowConstructorOptions,
) => {
  // Create the browser window.
  const overlayWindow = new BrowserWindow({
    show: false,
    height: 43,
    width: 474,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    hasShadow: false,
    minimizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    // resizable: false,
    webPreferences: {
      preload: OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: true,
    },
    minWidth: 80,
    minHeight: 80,
    ...options,
  });
  // and load the index.html of the app.
  overlayWindow.loadURL(url).then(() => {
    overlayWindow.showInactive();
  });

  overlayWindow.setAlwaysOnTop(true, "screen-saver");
  overlayWindow.setVisibleOnAllWorkspaces(true); // Ensures it's visible across all workspaces
  overlayWindow.setFullScreenable(false);

  overlayWindow.on("minimize", () => {
    overlayWindow.restore();
  });

  overlayWindow.on("system-context-menu", (event) => {
    event.preventDefault();
  });

  overlayWindow.on("close", (event) => {
    event.preventDefault();
  });

  return overlayWindow;
};
