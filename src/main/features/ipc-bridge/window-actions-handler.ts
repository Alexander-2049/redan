import { app, BrowserWindow, ipcMain } from 'electron';

import { LoggerService } from '../logger/LoggerService';

import { IPC_CHANNELS } from '@/shared/ipc/channels';

const logger = LoggerService.getLogger('ipc-bridge-window-actions-handler');

export function registerWindowActionsHandlers() {
  ipcMain.handle(IPC_CHANNELS.ACTIONS.MINIMIZE, event => {
    const win = BrowserWindow.fromWebContents(event.sender);
    logger.info('Minimizing window');
    return win?.minimize();
  });

  ipcMain.handle(IPC_CHANNELS.ACTIONS.RESTORE, event => {
    const win = BrowserWindow.fromWebContents(event.sender);
    logger.info('Restoring window');
    if (win) {
      return win.isMaximized() ? win.restore() : win.maximize();
    }
    logger.warn('No window found to restore/maximize');
    return null;
  });

  ipcMain.handle(IPC_CHANNELS.ACTIONS.CLOSE, () => {
    logger.info('IPC close requested');
    app.quit();
  });
}
