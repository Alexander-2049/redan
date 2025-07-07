import fs from 'fs/promises';

import { ipcMain, shell } from 'electron';

import { LoggerService } from '../logger/LoggerService';
import { Steam } from '../steam';

import { STEAM_APP_ID } from '@/main/shared/constants';
import { IPC_CHANNELS } from '@/shared/ipc/channels';
import { DownloadInfo, InstallInfo } from '@/shared/types/steam';

const logger = LoggerService.getLogger('ipc-workshop-handlers');

export function registerSteamHandlers() {
  ipcMain.handle(IPC_CHANNELS.WORKSHOP.GET_ALL_ITEMS, async (event, page: number) => {
    logger.info(`Received request to get all workshop items for page: ${page}`);
    const client = Steam.getInstance().getSteamClient();
    if (!client) {
      logger.warn('Steam client not available');
      return null;
    }
    try {
      const result = await client.workshop.getAllItems(
        page,
        client.workshop.UGCQueryType.RankedByVote,
        client.workshop.UGCType.All,
        STEAM_APP_ID,
        STEAM_APP_ID,
      );
      logger.info(`Successfully fetched workshop items for page: ${page}`);
      return result;
    } catch (error) {
      logger.error(
        `Error fetching workshop items for page ${page}: ${error instanceof Error ? error.message : String(error)}`,
      );
      return null;
    }
  });

  ipcMain.handle(IPC_CHANNELS.STEAM.IS_ONLINE, (): boolean => {
    const client = Steam.getInstance().getSteamClient();
    if (client) return true;
    return false;
  });

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.SUBSCRIBE, async (event, itemId: bigint): Promise<void> => {
    const client = Steam.getInstance().getSteamClient();
    if (!client) return;
    logger.info(`Subscribing to workshop item: ${itemId}`);
    await client.workshop.subscribe(itemId);
  });

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.UNSUBSCRIBE,
    async (event, itemId: bigint): Promise<void> => {
      const client = Steam.getInstance().getSteamClient();
      if (!client) return;
      logger.info(`Unsubscribing from workshop item: ${itemId}`);

      const folder = client.workshop.installInfo(itemId)?.folder;
      if (folder) {
        try {
          // Optional: safety check to avoid accidental root deletion
          if (folder.length > 10) {
            logger.info(`Removing folder: ${folder}`);
            await fs.rm(folder, { recursive: true, force: true });
            logger.info(`Folder removed: ${folder}`);
          } else {
            logger.warn(`Refused to delete suspiciously short folder path: ${folder}`);
          }
        } catch (error) {
          logger.error(`Failed to remove folder: ${folder}`, error);
        }
      }

      await client.workshop.unsubscribe(itemId);
    },
  );

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.GET_SUBSCRIBED_ITEMS, async () => {
    const client = Steam.getInstance().getSteamClient();
    if (!client) return [];
    logger.info('Fetching subscribed workshop items');
    await new Promise(r => setTimeout(r, 1000));
    return client.workshop.getSubscribedItems();
  });

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.DOWNLOAD_ITEM, (event, itemId: bigint): boolean => {
    const client = Steam.getInstance().getSteamClient();
    if (!client) return false;
    return client.workshop.download(itemId, true);
  });

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.DOWNLOAD_INFO,
    (event, itemId: bigint): DownloadInfo | null => {
      const client = Steam.getInstance().getSteamClient();
      if (!client) return null;
      return client.workshop.downloadInfo(itemId);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.GET_INSTALL_INFO,
    (event, itemId: bigint): InstallInfo | null => {
      const client = Steam.getInstance().getSteamClient();
      if (!client) return null;
      return client.workshop.installInfo(itemId);
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.OPEN_IN_STEAM_CLIENT,
    async (event, workshopId: string | number | bigint) => {
      const idStr = String(workshopId);
      const steamUrl = `steam://openurl/https://steamcommunity.com/sharedfiles/filedetails/?id=${idStr}`;

      try {
        return shell.openExternal(steamUrl);
      } catch (error) {
        logger.error('Failed to open Steam URL:', error);
        return;
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.CREATE, async (): Promise<null | bigint> => {
    const client = Steam.getInstance().getSteamClient();
    if (!client) return null;
    const item = await client.workshop.createItem(STEAM_APP_ID);
    if (item.needsToAcceptAgreement) {
      const steamUrl = `steam://openurl/https://steamcommunity.com/workshop/workshoplegalagreement/`;
      try {
        await shell.openExternal(steamUrl);
      } catch (error) {
        logger.error('Failed to open Steam URL:', error);
      }
    }
    return item.itemId;
  });

  // ipcMain.handle(
  //   IPC_CHANNELS.WORKSHOP.UPDATE_ITEM,
  //   async (event, itemId: bigint, props: UgcUpdate) => {
  //     const client = Steam.getInstance().getSteamClient();
  //     if (!client) return null;

  //     const result = await client.workshop.updateItem(itemId, props, STEAM_APP_ID);
  //   },
  // );
}
