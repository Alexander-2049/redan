import { contextBridge, ipcRenderer } from 'electron/renderer';

import { LayoutsActions, SteamActions, WindowActions } from '@/ipc-bridge-types';
import { IPC_CHANNELS } from '@/shared/ipc/channels';
import {
  WorkshopItemQueryConfig,
  WorkshopPaginatedResult,
  DownloadInfo,
  InstallInfo,
} from '@/shared/types/steam';

const windowActions: WindowActions = {
  minimize: () => void ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.MINIMIZE),
  restore: () => void ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.RESTORE),
  close: () => void ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.CLOSE),
};
// Actions for window controls
contextBridge.exposeInMainWorld('actions', windowActions);

// Steam actions
const steam: SteamActions = {
  isOnline: () => ipcRenderer.invoke(IPC_CHANNELS.STEAM.IS_ONLINE) as Promise<boolean>,
  workshop: {
    subscribe: (item: bigint) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.SUBSCRIBE, item) as Promise<void>,
    unsubscribe: (item: bigint) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.UNSUBSCRIBE, item) as Promise<void>,
    getWorkshopAllItems: (page: number, queryConfig: WorkshopItemQueryConfig) =>
      ipcRenderer.invoke(
        IPC_CHANNELS.WORKSHOP.GET_ALL_ITEMS,
        page,
        queryConfig,
      ) as Promise<WorkshopPaginatedResult | null>,
    getSubscribedItems: () =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.GET_SUBSCRIBED_ITEMS) as Promise<bigint[]>,
    downloadItem: (item: bigint) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.DOWNLOAD_ITEM, item) as Promise<boolean>,
    downloadInfo: (item: bigint) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.DOWNLOAD_INFO, item) as Promise<DownloadInfo | null>,
    getInstallInfo: (item: bigint) =>
      ipcRenderer.invoke(
        IPC_CHANNELS.WORKSHOP.GET_INSTALL_INFO,
        item,
      ) as Promise<InstallInfo | null>,
    openInSteamClient: (workshopId: bigint | number | string) => {
      void ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.OPEN_IN_STEAM_CLIENT, workshopId);
    },
  },
};

contextBridge.exposeInMainWorld('steam', steam);

const layouts: LayoutsActions = {
  getLayouts: () => ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.GET_LAYOUTS),
};
contextBridge.exposeInMainWorld('layouts', layouts);
