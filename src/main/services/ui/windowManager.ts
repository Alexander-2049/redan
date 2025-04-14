import { BrowserWindow, ipcMain } from "electron";
import OverlayHandler from "@/main/services/overlayService/OverlayHandler";
import { TitleBarEvent } from "@/shared/types/TitleBarEvent";
import { openOverlaysFolder } from "@/main/utils/openOverlaysFolder";

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

  addMessageHandlers();
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

const addMessageHandlers = () => {
  ipcMain.on("overlay-list-renderer-to-main", (event) => {
    const replyMessage = OverlayHandler.getAll();
    event.reply("overlay-list-main-to-renderer", replyMessage);
  });

  ipcMain.on("title-bar-message", (event, data: TitleBarEvent) => {
    const window = BrowserWindow.fromId(event.sender.id);
    if (!window) return;

    if (data === "close") {
      window.close();
    } else if (data === "minimize") {
      window.minimize();
    } else if (data === "restore") {
      if (window.isMaximized()) {
        window.restore();
      } else {
        window.maximize();
      }
    }
  });

  ipcMain.on("open-overlays-folder-renderer-to-main", () => {
    openOverlaysFolder();
  });
};

export const getWindows = () => windows;
export const addWindow = (window: BrowserWindow) => windows.push(window);
