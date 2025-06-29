import { ipcMain } from 'electron';

import { LoggerService } from '../logger/LoggerService';
import { Steam } from '../steam';

import { STEAM_APP_ID } from '@/main/shared/constants';
import { IPC_CHANNELS } from '@/shared/ipc/channels';

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
}
