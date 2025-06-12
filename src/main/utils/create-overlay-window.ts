import { BrowserWindow } from "electron";

declare const OVERLAY_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

export const createOverlayWindow = (
  url: string,
  options?: Electron.BrowserWindowConstructorOptions,
) => {
  // Create the browser window.
  const win = new BrowserWindow({
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
      contextIsolation: true, // ✅ Защита от доступа к Node.js из DOM
      nodeIntegration: false, // ✅ Запрет Node.js в модах
      sandbox: false, // ⛔ Не нужен, т.к. preload использует Node.js
      webSecurity: true, // ✅ Важно
      // devTools: false, // ⛔ или true, если надо отлаживать
    },
    minWidth: 80,
    minHeight: 80,
    ...options,
  });
  // and load the index.html of the app.
  win.loadURL(url).then(() => {
    win.showInactive();
  });

  win.setAlwaysOnTop(true, "screen-saver");
  win.setVisibleOnAllWorkspaces(true); // Ensures it's visible across all workspaces
  win.setFullScreenable(false);

  win.on("minimize", () => {
    win.restore();
  });

  win.on("system-context-menu", (event) => {
    event.preventDefault();
  });

  win.on("close", (event) => {
    event.preventDefault();
  });

  return win;
};
