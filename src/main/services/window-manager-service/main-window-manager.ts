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
import { IS_DEBUG } from "@/main/main-constants";
import { STEAM_APP_ID } from "@/shared/shared-constants";
import { getSteamClient } from "@/main/utils/steam-client";

const RECEIVE_POSTFIX = "renderer-to-main";
const SEND_POSTFIX = "main-to-renderer";

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
  ipcMain.on("overlay-list-" + RECEIVE_POSTFIX, (event) => {
    logger.info("Received overlay list request from renderer");
    const replyMessage = OverlayHandler.loadAllOverlays();
    event.reply("overlay-list-" + SEND_POSTFIX, replyMessage);
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

  ipcMain.on("open-overlays-folder-" + RECEIVE_POSTFIX, (event) => {
    logger.info("Received request to open overlays folder");
    openOverlaysFolder()
      .then(() => {
        logger.info("Overlays folder opened successfully");
        event.reply("open-overlays-folder-" + SEND_POSTFIX, true);
      })
      .catch((err) => {
        logger.error("Failed to open overlays folder", { error: err });
        event.reply("open-overlays-folder-" + SEND_POSTFIX, false);
      });
  });

  ipcMain.on("get-layouts-" + RECEIVE_POSTFIX, (event) => {
    logger.info("Received get-layouts request");
    const response = LayoutHandler.getAllLayouts();
    event.reply(
      "get-layouts-" + SEND_POSTFIX,
      response.success ? response.layouts : [],
    );
  });

  ipcMain.on(
    "create-empty-layout-" + RECEIVE_POSTFIX,
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

      event.reply("create-empty-layout-" + SEND_POSTFIX, response);
    },
  );

  ipcMain.on("delete-layout-" + RECEIVE_POSTFIX, (event, fileName: string) => {
    logger.info(`Deleting layout: ${fileName}`);
    const response = LayoutHandler.deleteLayout(fileName);
    overlayWindowManager.updateOverlayWindows();

    event.reply("delete-layout-" + SEND_POSTFIX, response);
  });

  ipcMain.on(
    "modify-layout-" + RECEIVE_POSTFIX,
    (event, fileName: string, updatedData: Partial<ILayout>) => {
      logger.info(`Modifying layout: ${fileName}`);
      const response = LayoutHandler.modifyLayout(fileName, updatedData);
      overlayWindowManager.updateOverlayWindows();

      event.reply("modify-layout-" + SEND_POSTFIX, response);
    },
  );

  ipcMain.on(
    "add-overlay-to-layout-" + RECEIVE_POSTFIX,
    (event, layoutFileName: string, overlayFolderName: string) => {
      logger.info(
        `Adding overlay ${overlayFolderName} to layout ${layoutFileName}`,
      );
      const response = LayoutHandler.addOverlay(
        layoutFileName,
        overlayFolderName,
      );
      overlayWindowManager.updateOverlayWindows();

      event.reply("add-overlay-to-layout-" + SEND_POSTFIX, response);
    },
  );

  ipcMain.on(
    "remove-overlay-from-layout-" + RECEIVE_POSTFIX,
    (event, layoutFileName: string, overlayId: string) => {
      logger.info(
        `Removing overlay ${overlayId} from layout ${layoutFileName}`,
      );
      const response = LayoutHandler.removeOverlay(layoutFileName, overlayId);
      overlayWindowManager.updateOverlayWindows();

      event.reply("remove-overlay-from-layout-" + SEND_POSTFIX, response);
    },
  );

  ipcMain.on(
    "set-active-layout-" + RECEIVE_POSTFIX,
    (event, layoutFileName: string) => {
      logger.info(`Setting active layout: ${layoutFileName}`);
      const response = LayoutHandler.setActiveLayout(layoutFileName);
      overlayWindowManager.updateOverlayWindows();

      event.reply("set-active-layout-" + SEND_POSTFIX, response);
    },
  );

  ipcMain.on(
    "set-selected-game-" + RECEIVE_POSTFIX,
    (event, gameName: GameName | null) => {
      logger.info(`Setting selected game: ${gameName}`);
      const success = gameDataHandler.selectGame(gameName);
      const response: DefaultResponse = success
        ? { success: true }
        : { success: false, error: "Failed to set the selected game." };

      if (!success) logger.warn("Failed to set selected game");

      event.reply("set-selected-game-" + SEND_POSTFIX, response);
    },
  );

  ipcMain.on("get-selected-game-" + RECEIVE_POSTFIX, (event) => {
    logger.info("Received get-selected-game request");
    event.reply(
      "get-selected-game-" + SEND_POSTFIX,
      gameDataHandler.getSelectedGame(),
    );
  });

  ipcMain.on(
    "set-overlays-locked-" + RECEIVE_POSTFIX,
    (event, locked: boolean) => {
      logger.info(`Setting overlays lock state: ${locked}`);
      if (locked) {
        overlayWindowManager.lock();
      } else {
        overlayWindowManager.unlock();
      }
      event.reply("set-overlays-locked-" + SEND_POSTFIX, {
        success: true,
      });
    },
  );

  ipcMain.on("get-overlays-locked-" + RECEIVE_POSTFIX, (event) => {
    logger.info("Received get-overlays-locked request");
    event.reply(
      "get-overlays-locked-" + SEND_POSTFIX,
      overlayWindowManager.isLocked(),
    );
  });

  ipcMain.on("record-demo-" + RECEIVE_POSTFIX, (event) => {
    logger.info("Start demo recording");
    gameDataHandler.startRecording();
    event.reply("record-demo-" + SEND_POSTFIX, {
      success: true,
    });
  });

  ipcMain.on("stop-record-demo-" + RECEIVE_POSTFIX, (event) => {
    logger.info("Stop demo recording");
    gameDataHandler.stopRecording();
    event.reply("stop-record-demo-" + SEND_POSTFIX, {
      success: true,
    });
  });

  ipcMain.on("is-debug-" + RECEIVE_POSTFIX, (event) => {
    logger.info(`Sending to client IS_DEBUG: ${IS_DEBUG}`);
    event.reply("is-debug-" + SEND_POSTFIX, IS_DEBUG);
  });

  ipcMain.on(
    "steam-get-workshop-subscribed-items-" + RECEIVE_POSTFIX,
    (event) => {
      const client = getSteamClient();
      const subscribedItems = client.workshop.getSubscribedItems();
      logger.info(
        "Sending to renderer steam workshop subscribed items: ",
        subscribedItems.join(", "),
      );
      event.reply(
        "steam-get-workshop-subscribed-items-" + SEND_POSTFIX,
        subscribedItems,
      );
    },
  );

  ipcMain.on(
    "steam-get-all-workshop-items-" + RECEIVE_POSTFIX,
    (event, page: number) => {
      const client = getSteamClient();
      const response = client.workshop.getAllItems(
        page,
        client.workshop.UGCQueryType.RankedByVote,
        client.workshop.UGCType.All,
        STEAM_APP_ID,
        STEAM_APP_ID,
      );
      response
        .then((e) => {
          console.log(e);
          event.reply("steam-get-all-workshop-items-" + SEND_POSTFIX, e);
        })
        .catch((e) => {
          console.log(e);
          event.reply("steam-get-all-workshop-items-" + SEND_POSTFIX, null);
        });
    },
  );
};

// client.workshop.createItem(STEAM_APP_ID).then((data) => {
//   client.workshop
//     .updateItem(
//       data.itemId,
//       {
//         contentPath:
//           "C:/Users/ALEXANDER/Desktop/Development/sim-racing-toolkit/public",
//       },
//       STEAM_APP_ID,
//     )
//     .then((data) => {
//       logger.info(
//         `${data.itemId} has been added to workshop${data.needsToAcceptAgreement ? "and Needs to Accept Agreement" : ""}`,
//       );
//     })
//     .catch((reason) => {
//       logger.warn(`Failed to updateItem: ${reason}`);
//     });
//   client.workshop
//     .updateItem(
//       data.itemId,
//       {
//         // changeNote: "Test changeNote",
//         description: "Test description",
//         previewPath:
//           "C:/Users/ALEXANDER/Desktop/Development/sim-racing-toolkit/public/logo.png",
//         // tags: ["tag1", "tag2"],
//         title: "Super title",
//         visibility: client.workshop.UgcItemVisibility.Public,
//       },
//       STEAM_APP_ID,
//     )
//     .then((data) => {
//       logger.info(
//         `${data.itemId} has been added to workshop${data.needsToAcceptAgreement ? "and Needs to Accept Agreement" : ""}`,
//       );
//     })
//     .catch((reason) => {
//       logger.warn(`Failed to updateItem: ${reason}`);
//     });
// });
