// src/main/steam/steam-handler.ts
import fs from 'fs/promises';

import { ipcMain, shell } from 'electron';

import { LoggerService } from '../logger/LoggerService';

import { callSteamWorker } from '@/main/steam/steam-runner';
import { STEAM_APP_ID } from '@/shared/constants';
import { IPC_CHANNELS } from '@/shared/ipc/channels';
import {
  DownloadInfo,
  InstallInfo,
  UgcItemVisibility,
  UgcUpdate,
  WorkshopPaginatedResult,
} from '@/shared/types/steam';

const logger = LoggerService.getLogger('ipc-workshop-handlers');

export function registerSteamHandlers() {
  //
  // Steam status ✅
  //
  ipcMain.handle(IPC_CHANNELS.STEAM.IS_ONLINE, async () => {
    const status = await callSteamWorker<boolean>('isOnline');
    logger.info(`Steam online status checked: ${status ? 'true' : 'false'}`);
    return status;
  });

  //
  // Workshop queries ✅
  //
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.GET_ALL_ITEMS, async (_, page: number) => {
    try {
      if (!(await callSteamWorker<boolean>('isOnline'))) return null;
      logger.info(`Successfully fetched public workshop items for page: ${page}`);
      return await callSteamWorker('workshop.getAllItems', page);
    } catch (err) {
      logger.error('Failed to fetch all items', err);
      return null;
    }
  });

  // Subscribe to item ✅
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.SUBSCRIBE, async (_, itemId: bigint) => {
    await callSteamWorker('workshop.subscribe', itemId);
  });

  // Unsubscribe from item (+delete) ✅
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.UNSUBSCRIBE, async (_, itemId: bigint) => {
    try {
      const installInfo = await callSteamWorker<InstallInfo | null>('workshop.installInfo', itemId);
      const folder = installInfo?.folder;
      if (folder) {
        if (folder.length > 10) {
          logger.info(`Removing folder: ${folder}`);
          await fs.rm(folder, { recursive: true, force: true });
        } else {
          logger.warn(`Suspiciously short folder path, not deleting: ${folder}`);
        }
      }
    } catch (err) {
      logger.error(`Failed cleanup for item ${itemId}`, err);
    }

    await callSteamWorker('workshop.unsubscribe', itemId);
  });

  // ✅
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.GET_SUBSCRIBED_ITEMS, async () => {
    return await callSteamWorker('workshop.getSubscribedItems');
  });

  // ✅
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.DOWNLOAD_ITEM, async (_, itemId: bigint) => {
    return await callSteamWorker<boolean>('workshop.download', itemId);
  });

  // ✅
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.DOWNLOAD_INFO, async (_, itemId: bigint) => {
    return await callSteamWorker<DownloadInfo | null>('workshop.downloadInfo', itemId);
  });

  // ✅
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.GET_INSTALL_INFO, async (_, itemId: bigint) => {
    return await callSteamWorker<InstallInfo | null>('workshop.installInfo', itemId);
  });

  // ✅
  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.OPEN_IN_STEAM_CLIENT,
    async (_, workshopId: string | number | bigint) => {
      const steamUrl = `steam://openurl/https://steamcommunity.com/sharedfiles/filedetails/?id=${workshopId}`;
      try {
        await shell.openExternal(steamUrl);
      } catch (err) {
        logger.error('Failed to open Steam URL', err);
      }
    },
  );

  // ✅
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.OPEN_IN_STEAM_CLIENT_UPLOADED_FILES, async () => {
    try {
      const userId = await callSteamWorker<string>('user.getSteamId');
      const steamUrl = `steam://openurl/https://steamcommunity.com/profiles/${userId}/myworkshopfiles/?appid=${STEAM_APP_ID}`;
      await shell.openExternal(steamUrl);
    } catch (err) {
      logger.error('Failed to open uploaded files in Steam', err);
    }
  });

  //
  // Workshop create/update
  //
  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.CREATE,
    async (_, props: UgcUpdate, visibility?: UgcItemVisibility) => {
      return await callSteamWorker<bigint>('workshop.create', { props, visibility });
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.UPDATE_ITEM,
    async (_, itemId: bigint, props: UgcUpdate, visibility?: UgcItemVisibility) => {
      return await callSteamWorker<bigint>('workshop.updateItem', { itemId, props, visibility });
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.GET_MY_PUBLISHED_ITEMS,
    async (_, page: number): Promise<WorkshopPaginatedResult | null> => {
      return await callSteamWorker('workshop.getMyPublishedItems', page);
    },
  );

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.GET_ITEMS, async (_, itemIds: string[] | bigint[]) => {
    let validItemIds: bigint[] = [];
    if (Array.isArray(itemIds)) {
      if (typeof itemIds[0] === 'bigint') {
        // Already an array of bigints
        validItemIds = itemIds as bigint[];
      } else {
        // Assume string[]
        for (const id of itemIds as string[]) {
          if (/^\d{6,}$/.test(id)) {
            try {
              validItemIds.push(BigInt(id));
            } catch {
              logger.warn(`Invalid item ID skipped (cannot convert to BigInt): ${id}`);
            }
          } else {
            logger.warn(`Invalid item ID skipped: ${id}`);
          }
        }
      }
    } else {
      logger.warn('itemIds is not an array');
      return null;
    }
    logger.info(
      `Fetching info for valid item IDs: ${validItemIds.map(id => id.toString()).join(', ')}`,
    );
    try {
      const result = await callSteamWorker('workshop.getItems', validItemIds);
      if (
        result &&
        typeof result === 'object' &&
        'items' in result &&
        Array.isArray(result.items)
      ) {
        logger.info(`Fetched info for ${result.items.length} items`);
      } else {
        logger.info('Fetched info for 0 items');
      }
      return result;
    } catch (error) {
      logger.error(
        `Failed to fetch items info: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  });
}
