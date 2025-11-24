import { ipcMain } from 'electron';

import buildMeta from '../../../../build-meta.json';

import { IPC_CHANNELS } from '@/shared/ipc/channels';

export function registerAppActionsHandlers() {
  ipcMain.handle(IPC_CHANNELS.APP.GET_BUILD_VERSION, () => {
    return buildMeta.buildVersion;
  });

  ipcMain.handle(IPC_CHANNELS.APP.GET_BUILD_DATE, () => {
    return buildMeta.buildDate;
  });

  ipcMain.handle(IPC_CHANNELS.APP.GET_COMMIT_COUNT, () => {
    return buildMeta.commitCount;
  });

  ipcMain.handle(IPC_CHANNELS.APP.GET_VERSION, () => {
    return buildMeta.version;
  });
}
