import fs from 'fs/promises';

import { ipcMain, shell } from 'electron';

import { LoggerService } from '../logger/LoggerService';
import { Steam } from '../steam';

import { STEAM_APP_ID } from '@/main/shared/constants';
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
        client.workshop.UGCType.ItemsReadyToUse,
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
    const status = !!client;
    logger.info(`Steam online status checked: ${status ? 'true' : 'false'}`);
    return status;
  });

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.SUBSCRIBE, async (event, itemId: bigint): Promise<void> => {
    logger.info(`Received request to subscribe to item ${itemId}`);
    const client = Steam.getInstance().getSteamClient();
    if (!client) {
      logger.warn('Steam client not available while subscribing');
      return;
    }
    await client.workshop.subscribe(itemId);
    logger.info(`Successfully subscribed to item ${itemId}`);
  });

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.UNSUBSCRIBE,
    async (event, itemId: bigint): Promise<void> => {
      logger.info(`Received request to unsubscribe from item ${itemId}`);
      const client = Steam.getInstance().getSteamClient();
      if (!client) {
        logger.warn('Steam client not available while unsubscribing');
        return;
      }

      const folder = client.workshop.installInfo(itemId)?.folder;
      if (folder) {
        try {
          if (folder.length > 10) {
            logger.info(`Attempting to remove folder: ${folder}`);
            await fs.rm(folder, { recursive: true, force: true });
            logger.info(`Successfully removed folder: ${folder}`);
          } else {
            logger.warn(`Suspiciously short folder path, not deleting: ${folder}`);
          }
        } catch (error) {
          logger.error(`Failed to remove folder: ${folder}`, error);
        }
      } else {
        logger.info(`No install folder found for item: ${itemId}`);
      }

      await client.workshop.unsubscribe(itemId);
      logger.info(`Successfully unsubscribed from item ${itemId}`);
    },
  );

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.GET_SUBSCRIBED_ITEMS, async () => {
    logger.info('Received request to fetch subscribed workshop items');
    const client = Steam.getInstance().getSteamClient();
    if (!client) {
      logger.warn('Steam client not available while fetching subscribed items');
      return [];
    }
    await new Promise(r => setTimeout(r, 1000));
    const items = client.workshop.getSubscribedItems();
    logger.info(`Fetched ${items.length} subscribed items`);
    return items;
  });

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.DOWNLOAD_ITEM, (event, itemId: bigint): boolean => {
    logger.info(`Received request to download item ${itemId.toString()}`);
    const client = Steam.getInstance().getSteamClient();
    if (!client) {
      logger.warn('Steam client not available while downloading');
      return false;
    }
    const result = client.workshop.download(itemId, true);
    logger.info(`Download triggered for item ${itemId.toString()}: ${result ? 'true' : 'false'}`);
    return result;
  });

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.DOWNLOAD_INFO,
    (event, itemId: bigint): DownloadInfo | null => {
      logger.info(`Received request to get download info for item ${itemId.toString()}`);
      const client = Steam.getInstance().getSteamClient();
      if (!client) {
        logger.warn('Steam client not available while getting download info');
        return null;
      }
      const info = client.workshop.downloadInfo(itemId);
      logger.info(
        `Download info for item ${itemId.toString()}: ${info?.current?.toString() || ''} / ${info?.total?.toString() || ''}`,
      );
      return info;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.GET_INSTALL_INFO,
    (event, itemId: bigint): InstallInfo | null => {
      logger.info(`Received request to get install info for item ${itemId}`);
      const client = Steam.getInstance().getSteamClient();
      if (!client) {
        logger.warn('Steam client not available while getting install info');
        return null;
      }
      const info = client.workshop.installInfo(itemId);
      logger.info(`Install info for item ${itemId}: ${JSON.stringify(info)}`);
      return info;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.OPEN_IN_STEAM_CLIENT,
    async (event, workshopId: string | number | bigint) => {
      const idStr = String(workshopId);
      const steamUrl = `steam://openurl/https://steamcommunity.com/sharedfiles/filedetails/?id=${idStr}`;
      logger.info(`Opening workshop item in Steam client: ${steamUrl}`);

      try {
        await shell.openExternal(steamUrl);
        logger.info(`Steam client opened URL: ${steamUrl}`);
      } catch (error) {
        logger.error('Failed to open Steam URL:', error);
      }
    },
  );

  ipcMain.handle(IPC_CHANNELS.WORKSHOP.OPEN_IN_STEAM_CLIENT_UPLOADED_FILES, async () => {
    const client = Steam.getInstance().getSteamClient();
    if (!client) {
      logger.warn('Steam client not available while getting install info');
      return null;
    }
    const userId = client.localplayer.getSteamId().steamId64.toString();
    const steamUrl = `steam://openurl/https://steamcommunity.com/profiles/${userId}/myworkshopfiles/?appid=${STEAM_APP_ID}`;
    logger.info(`Opening workshop uploaded files in Steam client: ${steamUrl}`);

    try {
      await shell.openExternal(steamUrl);
      logger.info(`Steam client opened URL: ${steamUrl}`);
    } catch (error) {
      logger.error('Failed to open Steam URL:', error);
    }
  });

  const openWorkshopAgreement = async () => {
    const steamUrl = `steam://openurl/https://steamcommunity.com/workshop/workshoplegalagreement/`;
    logger.info('Attempting to open workshop legal agreement URL');
    try {
      await shell.openExternal(steamUrl);
      logger.info('Workshop legal agreement URL opened');
    } catch (error) {
      logger.error('Failed to open Steam URL:', error);
    }
  };

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.CREATE,
    async (event, props: UgcUpdate, visibility?: UgcItemVisibility): Promise<null | bigint> => {
      logger.info('Received request to create new workshop item');
      const client = Steam.getInstance().getSteamClient();
      if (!client) {
        logger.warn('Steam client not available while creating item');
        return null;
      }
      const createdItem = await client.workshop.createItem(STEAM_APP_ID);

      let convertedVisibility: number | undefined;
      if (visibility) {
        logger.info(`Setting visibility to: ${visibility}`);
      }

      switch (visibility) {
        case 'FriendsOnly':
          convertedVisibility = client.workshop.UgcItemVisibility.FriendsOnly;
          break;
        case 'Private':
          convertedVisibility = client.workshop.UgcItemVisibility.Private;
          break;
        case 'Unlisted':
          convertedVisibility = client.workshop.UgcItemVisibility.Unlisted;
          break;
        case 'Public':
          convertedVisibility = client.workshop.UgcItemVisibility.Public;
          break;
      }

      const item = await client.workshop.updateItem(
        createdItem.itemId,
        {
          ...props,
          visibility: convertedVisibility,
        },
        STEAM_APP_ID,
      );

      logger.info(`Workshop item creation result: ${createdItem.itemId.toString()}}`);
      if (createdItem.needsToAcceptAgreement) {
        logger.info('User needs to accept workshop agreement');
        await openWorkshopAgreement();
      }
      return item.itemId;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.UPDATE_ITEM,
    async (event, itemId: bigint, props: UgcUpdate, visibility?: UgcItemVisibility) => {
      logger.info(`Received request to update workshop item ${itemId}`);
      const client = Steam.getInstance().getSteamClient();
      if (!client) {
        logger.warn('Steam client not available while updating item');
        return null;
      }

      let convertedVisibility: number | undefined;
      if (visibility) {
        logger.info(`Setting visibility to: ${visibility}`);
      }

      switch (visibility) {
        case 'FriendsOnly':
          convertedVisibility = client.workshop.UgcItemVisibility.FriendsOnly;
          break;
        case 'Private':
          convertedVisibility = client.workshop.UgcItemVisibility.Private;
          break;
        case 'Unlisted':
          convertedVisibility = client.workshop.UgcItemVisibility.Unlisted;
          break;
        case 'Public':
          convertedVisibility = client.workshop.UgcItemVisibility.Public;
          break;
      }

      const item = await client.workshop.updateItem(
        itemId,
        {
          ...props,
          visibility: convertedVisibility,
        },
        STEAM_APP_ID,
      );

      logger.info(`Update item response: ${JSON.stringify(item)}`);
      if (item.needsToAcceptAgreement) {
        logger.info('User needs to accept workshop agreement after update');
        await openWorkshopAgreement();
      }
      return item.itemId;
    },
  );

  ipcMain.handle(
    IPC_CHANNELS.WORKSHOP.GET_MY_ITEMS,
    async (event, page: 1): Promise<null | WorkshopPaginatedResult> => {
      logger.info(`Received request to fetch user's workshop items on page ${page}`);
      const client = Steam.getInstance().getSteamClient();

      // Check if client is initialized and user is logged in
      if (!client) {
        logger.warn('Steam client not available or user not logged in');
        return null;
      }

      const steamId = client.localplayer.getSteamId();
      const userId = steamId.accountId;
      logger.info(`Fetching items created by userId: ${userId}, page: ${page}`);

      try {
        const result = await client.workshop.getUserItems(
          page,
          userId,
          client.workshop.UserListType.Published,
          client.workshop.UGCType.All,
          client.workshop.UserListOrder.LastUpdatedDesc,
          {},
        );

        logger.info(`Fetched ${result.items.length} items`);
        return result as WorkshopPaginatedResult;
      } catch (error) {
        logger.error(
          `Failed to fetch user items: ${error instanceof Error ? error.message : String(error)}`,
        );
        return null;
      }
    },
  );
}
