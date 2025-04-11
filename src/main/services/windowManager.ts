import { BrowserWindow, ipcMain } from "electron";
import OverlayHandler from "./overlay/OverlayHandler";

const windows: BrowserWindow[] = [];

export const createWindow = (preload: string, entry: string): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    minWidth: 640,
    minHeight: 420,
    webPreferences: {
      preload,
      nodeIntegration: true,
    },
    frame: false,
    titleBarStyle: "hidden",
  });

  addMessageHandlers(mainWindow);
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.setAudioMuted(true);

  if (process.env.NODE_ENV === "development") {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.loadURL(entry);

  mainWindow.on("close", () => {
    windows.forEach((win) => {
      win.removeAllListeners("close");
      win.close();
    });
  });

  return mainWindow;
};

const addMessageHandlers = (w: BrowserWindow) => {
  ipcMain.on("main-message", (_, data) => {
    if (data === "get-mod-names") {
      OverlayHandler.getAll();
    }
  });

  ipcMain.on("title-bar-message", (_, data) => {
    if (data === "close") {
      w.close();
    } else if (data === "minimize") {
      w.minimize();
    } else if (data === "restore") {
      if (w.isMaximized()) {
        w.restore();
      } else {
        w.maximize();
      }
    }
  });
};

export const getWindows = () => windows;
export const addWindow = (window: BrowserWindow) => windows.push(window);
