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
import { GameName } from "../game-data/types/game-name-schema";
import { windowManagerServiceLogger as logger } from "@/main/loggers";
import { IS_DEBUG } from "@/main/main-constants";
import { STEAM_APP_ID } from "@/shared/shared-constants";
import { getSteamClient } from "@/main/utils/steam-client";
import { IPC_CHANNELS } from "@/shared/ipc-channels";
import { iRacingDataSchema } from "../game-data/games/iRacing/schema";
import { zodSchemaToJSON } from "../game-data/utils/zod-schema-to-json";
import { gameWebSocketServer } from "../game-websocket-server-service";
import { WorkshopItemQueryConfig } from "@/shared/schemas/steamworks-schemas";

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
    minWidth: 800,
    minHeight: 680,
    webPreferences: {
      preload,
      nodeIntegration: true,
      devTools: process.env.NODE_ENV === "development",
    },
    frame: false,
    titleBarStyle: "hidden",
    icon: iconPath,
  });

  registerHandlers(mainWindow);

  mainWindow.setMenuBarVisibility(false);
  mainWindow.webContents.setAudioMuted(true);
  mainWindow.loadURL(entry);
  logger.info("Main window loaded with entry URL");

  mainWindow.on("close", () => {
    logger.info("Main window is closing, cleaning up overlay windows");
    mainWindow.removeAllListeners("close");
    mainWindow.close();
    overlayWindowManager.closeAllOverlays();
  });

  LayoutHandler.addListener("modified", (data) => {
    mainWindow.webContents.send("layout-modified", data);
  });

  return mainWindow;
};

function registerHandlers(mainWindow: BrowserWindow) {
  ipcMain.handle(IPC_CHANNELS.GET_OVERLAY_LIST, () => {
    logger.info("Received overlay list request from renderer");
    return OverlayHandler.loadAllOverlays();
  });

  ipcMain.handle("title-bar", (_, data: TitleBarEvent) => {
    logger.info(`Received title bar message: ${data}`);
    if (!mainWindow) return;

    switch (data) {
      case "close":
        mainWindow.close();
        break;
      case "minimize":
        mainWindow.minimize();
        break;
      case "restore":
        mainWindow.isMaximized() ? mainWindow.restore() : mainWindow.maximize();
        break;
    }
  });

  ipcMain.handle(IPC_CHANNELS.OPEN_OVERLAYS_FOLDER, async () => {
    try {
      await openOverlaysFolder();
      logger.info("Overlays folder opened successfully");
      return true;
    } catch (err) {
      logger.error("Failed to open overlays folder", { error: err });
      return false;
    }
  });

  ipcMain.handle(IPC_CHANNELS.GET_LAYOUTS, () => {
    const response = LayoutHandler.getAllLayouts();
    return response.success ? response.layouts : [];
  });

  ipcMain.handle(
    IPC_CHANNELS.CREATE_EMPTY_LAYOUT,
    (_, layoutName: string, layoutDescription: string) => {
      const { width: screenWidth, height: screenHeight } =
        screen.getPrimaryDisplay().size;
      logger.info(`Creating layout: ${layoutName}`);
      return LayoutHandler.createNewLayout({
        layoutName,
        screenWidth,
        screenHeight,
        description: layoutDescription,
      });
    },
  );

  ipcMain.handle(IPC_CHANNELS.DELETE_LAYOUT, (_, fileName: string) => {
    logger.info(`Deleting layout: ${fileName}`);
    const response = LayoutHandler.deleteLayout(fileName);
    overlayWindowManager.updateOverlayWindows();
    return response;
  });

  ipcMain.handle(
    IPC_CHANNELS.MODIFY_LAYOUT,
    (_, fileName: string, updatedData: Partial<ILayout>) => {
      logger.info(`Modifying layout: ${fileName}`);
      const response = LayoutHandler.modifyLayout(fileName, updatedData);
      overlayWindowManager.updateOverlayWindows();
      return response;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.ADD_OVERLAY_TO_LAYOUT,
    (_, layoutFileName: string, overlayFolderName: string) => {
      logger.info(
        `Adding overlay ${overlayFolderName} to layout ${layoutFileName}`,
      );
      const response = LayoutHandler.addOverlay(
        layoutFileName,
        overlayFolderName,
      );
      overlayWindowManager.updateOverlayWindows();
      return response;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.REMOVE_OVERLAY_FROM_LAYOUT,
    (_, layoutFileName: string, overlayId: string) => {
      logger.info(
        `Removing overlay ${overlayId} from layout ${layoutFileName}`,
      );
      const response = LayoutHandler.removeOverlay(layoutFileName, overlayId);
      overlayWindowManager.updateOverlayWindows();
      return response;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.SET_ACTIVE_LAYOUT,
    (_, layoutFileName: string) => {
      logger.info(`Setting active layout: ${layoutFileName}`);
      const response = LayoutHandler.setActiveLayout(layoutFileName);
      overlayWindowManager.updateOverlayWindows();
      return response;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.SET_SELECTED_GAME,
    (_, gameName: GameName | null): DefaultResponse => {
      logger.info(`Setting selected game: ${gameName}`);
      const success = gameDataHandler.selectGame(gameName);
      if (!success) logger.warn("Failed to set selected game");
      return success
        ? { success: true }
        : { success: false, error: "Failed to set the selected game." };
    },
  );

  ipcMain.handle(IPC_CHANNELS.GET_SELECTED_GAME, () => {
    logger.info("Received get-selected-game request");
    return gameDataHandler.getSelectedGame();
  });

  ipcMain.handle(IPC_CHANNELS.SET_OVERLAYS_LOCKED, (_, locked: boolean) => {
    logger.info(`Setting overlays lock state: ${locked}`);
    locked ? overlayWindowManager.lock() : overlayWindowManager.unlock();
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.GET_OVERLAYS_LOCKED, () => {
    logger.info("Received get-overlays-locked request");
    return overlayWindowManager.isLocked();
  });

  ipcMain.handle(IPC_CHANNELS.RECORD_DEMO, () => {
    logger.info("Start demo recording");
    gameDataHandler.startRecording();
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.STOP_RECORD_DEMO, () => {
    logger.info("Stop demo recording");
    gameDataHandler.stopRecording();
    return { success: true };
  });

  ipcMain.handle(IPC_CHANNELS.IS_DEBUG, () => {
    logger.info(`Sending to client IS_DEBUG: ${IS_DEBUG}`);
    return IS_DEBUG;
  });

  ipcMain.handle(IPC_CHANNELS.STEAM_GET_WORKSHOP_SUBSCRIBED_ITEMS, () => {
    const client = getSteamClient();
    if (!client) return null;
    const subscribedItems = client.workshop.getSubscribedItems();
    logger.info(
      "Sending to renderer steam workshop subscribed items: ",
      subscribedItems.join(", "),
    );
    return subscribedItems;
  });

  ipcMain.handle(
    IPC_CHANNELS.STEAM_GET_WORKSHOP_ALL_ITEMS,
    async (_, page: number) => {
      const client = getSteamClient();
      if (!client) return null;
      try {
        const response = await client.workshop.getAllItems(
          page,
          client.workshop.UGCQueryType.RankedByVote,
          client.workshop.UGCType.All,
          STEAM_APP_ID,
          STEAM_APP_ID,
        );
        return response;
      } catch (e) {
        logger.error("Failed to fetch workshop items", { error: e });
        return null;
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.GET_GAME_DATA_SHAPE, (_, game: GameName) => {
    if (game === "iRacing") {
      return JSON.stringify(zodSchemaToJSON(iRacingDataSchema, false));
    }
    return {};
  });

  ipcMain.handle(
    IPC_CHANNELS.TITLE_BAR_MESSAGE,
    (event, action: TitleBarEvent) => {
      const window = BrowserWindow.fromId(event.sender.id);
      if (!window) return;

      if (action === "close") {
        window.close();
      } else if (action === "minimize") {
        window.minimize();
      } else if (action === "restore") {
        if (window.isMaximized()) {
          window.restore();
        } else {
          window.maximize();
        }
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.SET_IS_PREVIEW_MODE, (_, isPreview: boolean) => {
    gameWebSocketServer.setIsPreview(isPreview);
    return isPreview;
  });

  ipcMain.handle(IPC_CHANNELS.GET_IS_PREVIEW_MODE, () => {
    return false;
  });

  /*
  STEAM_IS_ONLINE: "get-steam-is-online",
  STEAM_GET_ALL_WORKSHOP_ITEMS: "get-steam-all-workshop-items",
  STEAM_WORKSHOP_SUBSCRIBE: "steam-worshop-subscribe",
  STEAM_WORKSHOP_UNUBSCRIBE: "steam-worshop-unsubscribe",
  */
  ipcMain.handle(
    IPC_CHANNELS.STEAM_GET_ALL_WORKSHOP_ITEMS,
    (e, page: number, queryConfig?: WorkshopItemQueryConfig) => {
      const client = getSteamClient();
      if (!client) return;
      return client.workshop.getAllItems(
        page,
        client.workshop.UGCQueryType.RankedByVote,
        client.workshop.UGCType.Items,
        STEAM_APP_ID,
        STEAM_APP_ID,
        queryConfig,
      );
    },
  );

  let subscriptionSequence = 0;
  let latestSubscribedItemsRequest = 0;

  ipcMain.handle(
    IPC_CHANNELS.STEAM_WORKSHOP_SUBSCRIBE,
    async (e, itemId: bigint) => {
      const client = getSteamClient();
      if (!client) return;

      logger.info(`Subscribing to workshop item: ${itemId}`);
      subscriptionSequence++;
      await client.workshop.subscribe(itemId);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.STEAM_WORKSHOP_UNSUBSCRIBE,
    async (e, itemId: bigint) => {
      const client = getSteamClient();
      if (!client) return;

      logger.info(`Unsubscribing from workshop item: ${itemId}`);
      subscriptionSequence++;
      await client.workshop.unsubscribe(itemId);
    },
  );

  ipcMain.handle(IPC_CHANNELS.STEAM_WORKSHOP_SUBSCRIBED_ITEMS, async () => {
    const client = getSteamClient();
    if (!client) return [];

    const requestId = ++latestSubscribedItemsRequest;
    const currentSequence = subscriptionSequence;

    const getItems = () => {
      const items = client.workshop.getSubscribedItems();
      logger.info("Subscribed items:", items);
      return items;
    };

    // Wait 1s to allow client to update (default delay)
    await new Promise((r) => setTimeout(r, 1000));

    // If during the delay a new subscribe/unsubscribe occurred, re-fetch and delay again
    if (currentSequence !== subscriptionSequence) {
      logger.info(
        "Subscription list possibly changed mid-request, re-fetching...",
      );
      // Optional: prevent infinite loop if changes keep happening
      await new Promise((r) => setTimeout(r, 500));
    }

    // If a newer subscribed_items request has been made, cancel this one
    if (requestId < latestSubscribedItemsRequest) {
      logger.info(
        "Newer subscribed_items request superseded this one. Returning stale data.",
      );
      return []; // or you can throw/cancel
    }

    return getItems();
  });
}

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
