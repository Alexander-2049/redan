import { contextBridge, ipcRenderer } from 'electron/renderer';

import { IPC_CHANNELS } from '@/shared/ipc/channels';
import { WorkshopItemQueryConfig, WorkshopItemsResult } from '@/shared/types/steam';

contextBridge.exposeInMainWorld('actions', {
  minimize: () => ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.MINIMIZE),
  restore: () => ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.RESTORE),
  close: () => ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.CLOSE),
});

contextBridge.exposeInMainWorld('steam', {
  getWorkshopAllItems: (
    page: number,
    queryConfig: WorkshopItemQueryConfig,
  ): Promise<WorkshopItemsResult | null> => {
    return ipcRenderer
      .invoke(IPC_CHANNELS.WORKSHOP.GET_ALL_ITEMS, page, queryConfig)
      .then(result => result as WorkshopItemsResult | null);
  },
});
