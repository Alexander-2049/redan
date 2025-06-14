import { app, BrowserWindow, ipcMain, screen } from "electron";
import { OverlayHandler } from "@/main/services/overlay-service";
import { TitleBarEvent } from "@/shared/types/title-bar-event";
import { openOverlaysFolder } from "@/main/utils/open-overlays-folder";
import {
  DefaultResponse,
  LayoutHandler,
} from "../layout-service/layout-handler";
import { ILayout } from "../layout-service/schemas/layoutSchema";
import { ILayoutOverlaySetting } from "../layout-service/schemas/overlaySchema";
import path from "path";
import { overlayWindowManager } from "@/main";
import gameDataHandler from "../game-data";
import { GameName } from "../game-data/types/game-name";
import { windowManagerServiceLogger as logger } from "@/main/loggers";

export interface OverlayWindow {
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
  logger.info("Creating main window...");
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
  logger.info("Main window loaded with entry URL");

  mainWindow.on("close", () => {
    logger.info("Main window is closing, cleaning up overlay windows");
    if (mainWindow) {
      mainWindow.removeAllListeners("close");
      mainWindow.close();
    }

    overlayWindowManager.closeAllOverlays();
  });

  LayoutHandler.addListener("modified", (data) => {
    mainWindow.webContents.send("layout-modified", data);
  });

  return mainWindow;
};

const addMessageHandlers = () => {
  ipcMain.on("overlay-list-renderer-to-main", (event) => {
    logger.info("Received overlay list request from renderer");
    const replyMessage = OverlayHandler.loadAllOverlays();
    event.reply("overlay-list-main-to-renderer", replyMessage);
  });

  ipcMain.on("title-bar-message", (event, data: TitleBarEvent) => {
    logger.info(`Received title bar message: ${data}`);
    const window = BrowserWindow.fromId(event.sender.id);
    if (!window) {
      logger.warn("Window not found for title bar message");
      return;
    }

    if (data === "close") {
      window.close();
    } else if (data === "minimize") {
      window.minimize();
    } else if (data === "restore") {
      window.isMaximized() ? window.restore() : window.maximize();
    }
  });

  ipcMain.on("open-overlays-folder-renderer-to-main", (event) => {
    logger.info("Received request to open overlays folder");
    openOverlaysFolder()
      .then(() => {
        logger.info("Overlays folder opened successfully");
        event.reply("open-overlays-folder-main-to-renderer", true);
      })
      .catch((err) => {
        logger.error("Failed to open overlays folder", { error: err });
        event.reply("open-overlays-folder-main-to-renderer", false);
      });
  });

  ipcMain.on("get-layouts-renderer-to-main", (event) => {
    logger.info("Received get-layouts request");
    const response = LayoutHandler.getAllLayouts();
    event.reply(
      "get-layouts-main-to-renderer",
      response.success ? response.layouts : [],
    );
  });

  ipcMain.on(
    "create-empty-layout-renderer-to-main",
    (event, layoutName: string, layoutDescription: string) => {
      logger.info(`Creating layout: ${layoutName}`);
      const { width: screenWidth, height: screenHeight } =
        screen.getPrimaryDisplay().size;

      const response = LayoutHandler.createNewLayout({
        layoutName,
        screenWidth,
        screenHeight,
        description: layoutDescription,
      });

      event.reply("create-empty-layout-main-to-renderer", response);
    },
  );

  ipcMain.on("delete-layout-renderer-to-main", (event, fileName: string) => {
    logger.info(`Deleting layout: ${fileName}`);
    const response = LayoutHandler.deleteLayout(fileName);
    overlayWindowManager.updateOverlayWindows();

    event.reply("delete-layout-main-to-renderer", response);
  });

  ipcMain.on(
    "modify-layout-renderer-to-main",
    (event, fileName: string, updatedData: Partial<ILayout>) => {
      logger.info(`Modifying layout: ${fileName}`);
      const response = LayoutHandler.modifyLayout(fileName, updatedData);
      overlayWindowManager.updateOverlayWindows();

      event.reply("modify-layout-main-to-renderer", response);
    },
  );

  ipcMain.on(
    "add-overlay-to-layout-renderer-to-main",
    (event, layoutFileName: string, overlayFolderName: string) => {
      logger.info(
        `Adding overlay ${overlayFolderName} to layout ${layoutFileName}`,
      );
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
      logger.info(
        `Removing overlay ${overlayId} from layout ${layoutFileName}`,
      );
      const response = LayoutHandler.removeOverlay(layoutFileName, overlayId);
      overlayWindowManager.updateOverlayWindows();

      event.reply("remove-overlay-from-layout-main-to-renderer", response);
    },
  );

  ipcMain.on(
    "set-active-layout-renderer-to-main",
    (event, layoutFileName: string) => {
      logger.info(`Setting active layout: ${layoutFileName}`);
      const response = LayoutHandler.setActiveLayout(layoutFileName);
      overlayWindowManager.updateOverlayWindows();

      event.reply("set-active-layout-main-to-renderer", response);
    },
  );

  ipcMain.on(
    "set-selected-game-renderer-to-main",
    (event, gameName: GameName | null) => {
      logger.info(`Setting selected game: ${gameName}`);
      const success = gameDataHandler.selectGame(gameName);
      const response: DefaultResponse = success
        ? { success: true }
        : { success: false, error: "Failed to set the selected game." };

      if (!success) logger.warn("Failed to set selected game");

      event.reply("set-selected-game-main-to-renderer", response);
    },
  );

  ipcMain.on("get-selected-game-renderer-to-main", (event) => {
    logger.info("Received get-selected-game request");
    event.reply(
      "get-selected-game-main-to-renderer",
      gameDataHandler.getSelectedGame(),
    );
  });

  ipcMain.on(
    "set-overlays-locked-renderer-to-main",
    (event, locked: boolean) => {
      logger.info(`Setting overlays lock state: ${locked}`);
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
    logger.info("Received get-overlays-locked request");
    event.reply(
      "get-overlays-locked-main-to-renderer",
      overlayWindowManager.isLocked(),
    );
  });

  ipcMain.on("record-demo-renderer-to-main", (event) => {
    logger.info("Start demo recording");
    gameDataHandler.startRecording();
    event.reply("record-demo-main-to-renderer", {
      success: true,
    });
  });

  ipcMain.on("stop-record-demo-renderer-to-main", (event) => {
    logger.info("Stop demo recording");
    gameDataHandler.stopRecording();
    event.reply("stop-record-demo-main-to-renderer", {
      success: true,
    });
  });
};
