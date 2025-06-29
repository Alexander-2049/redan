import { ipcMain } from 'electron';

import { LoggerService } from '../logger/LoggerService';

import { LayoutFile } from '@/main/shared/types/LayoutFile';
import { layoutWindowManager } from '@/main/widgets/layout-management';
import { IPC_CHANNELS } from '@/shared/ipc/channels';

const logger = LoggerService.getLogger('ipc-layout-handlers');

export function registerLayoutHandlers() {
  ipcMain.handle(IPC_CHANNELS.LAYOUTS.GET_LAYOUTS, (): LayoutFile[] => {
    logger.info('Fetching layouts...');
    const layouts = layoutWindowManager.getLayouts();
    logger.info(`Fetched ${layouts.length} layouts.`);
    return layouts;
  });
}
