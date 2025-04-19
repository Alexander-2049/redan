import { BrowserWindow, ipcMain, screen } from "electron";
import OverlayHandler from "@/main/services/overlayService/overlayHandler";
import { TitleBarEvent } from "@/shared/types/TitleBarEvent";
import { openOverlaysFolder } from "@/main/utils/openOverlaysFolder";
import { LayoutHandler } from "../layoutService/layoutHandler";

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

  ipcMain.on("open-overlays-folder-renderer-to-main", (event) => {
    openOverlaysFolder()
      .then(() => {
        event.reply("open-overlays-folder-main-to-renderer", true);
      })
      .catch(() => {
        event.reply("open-overlays-folder-main-to-renderer", false);
      });
  });

  ipcMain.on("get-layouts-renderer-to-main", (event) => {
    const response = LayoutHandler.getAllLayouts();
    if (response.success) {
      event.reply("get-layouts-main-to-renderer", response.layouts);
    } else {
      event.reply("get-layouts-main-to-renderer", []);
    }
  });

  ipcMain.on(
    "create-empty-layout-renderer-to-main",
    (event, filename: string) => {
      const { width: screenWidth, height: screenHeight } =
        screen.getPrimaryDisplay().workAreaSize;

      LayoutHandler.createNewLayout({
        fileName: filename,
        screenWidth,
        screenHeight,
      });

      const response = LayoutHandler.getAllLayouts();
      if (response.success) {
        event.reply("create-empty-layout-main-to-renderer", response.layouts);
      } else {
        event.reply("create-empty-layout-main-to-renderer", []);
      }
    },
  );
};

export const getWindows = () => windows;
export const addWindow = (window: BrowserWindow) => windows.push(window);
