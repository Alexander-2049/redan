import fs from 'fs/promises';

import { ipcMain } from 'electron';

import { LoggerService } from '../logger/LoggerService';

import { IPC_CHANNELS } from '@/shared/ipc/channels';

const logger = LoggerService.getLogger('ipc-fs-handlers');

export function registerFsHandlers() {
  ipcMain.handle(IPC_CHANNELS.FS.READ, async (event, path: string) => {
    logger.info(`Reading and sending ${path}`);
    return fs.readFile(path, 'utf-8');
  });
}
