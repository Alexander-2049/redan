import { BrowserWindow } from 'electron';

import { LoggerService } from '../logger/LoggerService';

import { IpcMessageHandler } from '@/main/shared/types/IpcMessageHandler';
import { IPC_CHANNELS } from '@/shared/ipc/channels';

const logger = LoggerService.getLogger('ipc-bridge-window-actions-handler');

export const windowActionsHandlers: IpcMessageHandler[] = [
  {
    channel: IPC_CHANNELS.ACTIONS.MINIMIZE,
    handler: (win: BrowserWindow) => {
      logger.info('Minimizing window');
      return win.minimize();
    },
  },
  {
    channel: IPC_CHANNELS.ACTIONS.RESTORE,
    handler: (win: BrowserWindow) => {
      logger.info('Restoring window');
      return win.isMaximized() ? win.restore() : win.maximize();
    },
  },
  {
    channel: IPC_CHANNELS.ACTIONS.CLOSE,
    handler: (win: BrowserWindow) => {
      logger.info('Closing window');
      return win.close();
    },
  },
];
