import { app, BrowserWindow, ipcMain, screen } from "electron";
import OverlayHandler from "@/main/services/overlayService/overlayHandler";
import { TitleBarEvent } from "@/shared/types/TitleBarEvent";
import { openOverlaysFolder } from "@/main/utils/openOverlaysFolder";
import { IResponse, LayoutHandler } from "../layoutService/layoutHandler";
import { ILayout } from "../layoutService/schemas/layoutSchema";
import { ILayoutOverlaySetting } from "../layoutService/schemas/overlaySchema";
import path from "path";
import { overlayWindowManager } from "@/main";
import gameDataHandler from "../game-data";
import { GameName } from "../game-data/types/GameName";

export interface IOverlayWindow {
  overlayId: string;
  overlaySettings: ILayoutOverlaySetting[];
  window: BrowserWindow;
}

const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, "public", "logo.ico")
  : path.join(__dirname, "..", "..", "public", "logo.ico");

export const createMainWindow = (
  preload: string,
  entry: string,
): BrowserWindow => {
  const mainWindow = new BrowserWindow({
    height: 880,
    width: 1280,
    minWidth: 1280,
    minHeight: 880,
    webPreferences: {
      preload,
      nodeIntegration: true,
      devTools: process.env.NODE_ENV === "development",
    },
    frame: false,
    titleBarStyle: "hidden",
    icon: iconPath,
  });

  addMessageHandlers();
  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.setAudioMuted(true);

  mainWindow.loadURL(entry);

  mainWindow.on("close", () => {
    if (mainWindow) {
      mainWindow.removeAllListeners("close");
      mainWindow.close();
    }

    overlayWindowManager.closeAllOverlays();
  });

  return mainWindow;
};

const addMessageHandlers = () => {
  ipcMain.on("overlay-list-renderer-to-main", (event) => {
    const replyMessage = OverlayHandler.loadAllOverlays();
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
    (event, layoutName: string, layoutDescription: string) => {
      const { width: screenWidth, height: screenHeight } =
        screen.getPrimaryDisplay().size;

      const response = LayoutHandler.createNewLayout({
        layoutName: layoutName,
        screenWidth,
        screenHeight,
        description: layoutDescription,
      });

      event.reply("create-empty-layout-main-to-renderer", response);
    },
  );

  ipcMain.on("delete-layout-renderer-to-main", (event, fileName: string) => {
    const response = LayoutHandler.deleteLayout(fileName);
    overlayWindowManager.updateOverlayWindows();

    event.reply("delete-layout-main-to-renderer", response);
  });

  ipcMain.on(
    "modify-layout-renderer-to-main",
    (event, fileName: string, updatedData: Partial<ILayout>) => {
      const response = LayoutHandler.modifyLayout(fileName, updatedData);
      overlayWindowManager.updateOverlayWindows();

      event.reply("modify-layout-main-to-renderer", response);
    },
  );

  ipcMain.on(
    "add-overlay-to-layout-renderer-to-main",
    (event, layoutFileName: string, overlayFolderName: string) => {
      const response = LayoutHandler.addOverlay(
        layoutFileName,
        overlayFolderName,
      );
      overlayWindowManager.updateOverlayWindows();

      event.reply("add-overlay-to-layout-main-to-renderer", response);
    },
  );
  ipcMain.on(
    "remove-overlay-from-layout-renderer-to-main",
    (event, layoutFileName: string, overlayId: string) => {
      const response = LayoutHandler.removeOverlay(layoutFileName, overlayId);
      overlayWindowManager.updateOverlayWindows();

      event.reply("remove-overlay-from-layout-main-to-renderer", response);
    },
  );
  ipcMain.on(
    "set-active-layout-renderer-to-main",
    (event, layoutFileName: string) => {
      const response = LayoutHandler.setActiveLayout(layoutFileName);
      overlayWindowManager.updateOverlayWindows();

      event.reply("set-active-layout-main-to-renderer", response);
    },
  );

  ipcMain.on(
    "set-selected-game-renderer-to-main",
    (event, gameName: GameName | null) => {
      const success = gameDataHandler.selectGame(gameName);
      const response: IResponse = success
        ? { success: true }
        : { success: false, error: "Failed to set the selected game." };

      event.reply("set-selected-game-main-to-renderer", response);
    },
  );

  ipcMain.on("get-selected-game-renderer-to-main", (event) => {
    event.reply(
      "get-selected-game-main-to-renderer",
      gameDataHandler.getSelectedGame(),
    );
  });

  ipcMain.on(
    "set-overlays-locked-renderer-to-main",
    (event, locked: boolean) => {
      if (locked) {
        overlayWindowManager.lock();
      } else {
        overlayWindowManager.unlock();
      }
      event.reply("set-overlays-locked-main-to-renderer", {
        success: true,
      });
    },
  );

  ipcMain.on("get-overlays-locked-renderer-to-main", (event) => {
    event.reply(
      "get-overlays-locked-main-to-renderer",
      overlayWindowManager.isLocked(),
    );
  });

  ipcMain.on("record-demo-renderer-to-main", (event) => {
    gameDataHandler.startRecording();
    event.reply("record-demo-main-to-renderer", {
      success: true,
    });
  });
  ipcMain.on("stop-record-demo-renderer-to-main", (event) => {
    gameDataHandler.stopRecording();
    event.reply("stop-record-demo-main-to-renderer", {
      success: true,
    });
  });
};
