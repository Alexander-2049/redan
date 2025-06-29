import { BrowserWindow, ipcMain } from 'electron';

import { LoggerService } from '../logger/LoggerService';

import { windowActionsHandlers } from './window-actions-handler';

const handlers = [...windowActionsHandlers];
const logger = LoggerService.getLogger('ipc-bridge');

export const registerIpcMessageHandlers = () => {
  handlers.forEach(({ channel, handler }) => {
    ipcMain.handle(channel, event => {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win || win.isDestroyed()) {
        logger.warn(`Invalid or destroyed window for channel: ${channel}`);
        return;
      }

      if (win) {
        return handler(win);
      } else {
        logger.warn(`No window found for channel: ${channel}`);
      }
    });
  });
};
