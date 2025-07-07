import { contextBridge, ipcRenderer } from 'electron/renderer';

import { LayoutsActions, OverlayActions, SteamActions, WindowActions } from '@/ipc-bridge-types';
import { IPC_CHANNELS } from '@/shared/ipc/channels';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import { SettingsMap } from '@/shared/types/SettingValue';
import {
  WorkshopItemQueryConfig,
  WorkshopPaginatedResult,
  DownloadInfo,
  InstallInfo,
  UgcUpdate,
  UgcItemVisibility,
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
    getMyItems: (page: number) => ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.GET_MY_ITEMS, page),
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
    create: () => ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.CREATE),
    updateItem: (itemId: bigint, props: UgcUpdate, visibility?: UgcItemVisibility) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.UPDATE_ITEM, itemId, props, visibility),
  },
};

contextBridge.exposeInMainWorld('steam', steam);

const layouts: LayoutsActions = {
  getLayouts: () => ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.GET_LAYOUTS),
};
contextBridge.exposeInMainWorld('layouts', layouts);

const overlay: OverlayActions = {
  open: (url: string, manifest: OverlayManifestFile) =>
    ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.OPEN, url, manifest) as Promise<void>,
  close: () => ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.CLOSE) as Promise<void>,
  updateEditMode: (mode: boolean) =>
    ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.UPDATE_EDIT_MODE, mode) as Promise<void>,
  updateSettings: (settings: SettingsMap[]) =>
    ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.UPDATE_SETTINGS, settings) as Promise<void>,
};

contextBridge.exposeInMainWorld('overlay', overlay);
