import { contextBridge, ipcRenderer } from 'electron/renderer';

import {
  FSActions,
  LayoutsActions,
  OverlayActions,
  SteamActions,
  WindowActions,
} from '@/ipc-bridge-types';
import { GameName } from '@/main/shared/types/GameName';
import { IPC_CHANNELS } from '@/shared/ipc/channels';
import { CreateLayoutProps } from '@/shared/types/CreateLayoutProps';
import { LayoutFile } from '@/shared/types/LayoutFile';
import { OverlayExtended } from '@/shared/types/OverlayExtended';
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
    getAllItems: (page: number, queryConfig: WorkshopItemQueryConfig) =>
      ipcRenderer.invoke(
        IPC_CHANNELS.WORKSHOP.GET_ALL_ITEMS,
        page,
        queryConfig,
      ) as Promise<WorkshopPaginatedResult | null>,
    getMyPublishedItems: (page: number) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.GET_MY_PUBLISHED_ITEMS, page),
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
    openInSteamClientUploadedFiles: () => {
      void ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.OPEN_IN_STEAM_CLIENT_UPLOADED_FILES);
    },
    create: (props: UgcUpdate, visibility?: UgcItemVisibility) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.CREATE, props, visibility),
    updateItem: (itemId: bigint, props: UgcUpdate, visibility?: UgcItemVisibility) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.UPDATE_ITEM, itemId, props, visibility),
    getItems: (itemIds: string[] | bigint[]) =>
      ipcRenderer.invoke(IPC_CHANNELS.WORKSHOP.GET_ITEMS, itemIds),
  },
};

contextBridge.exposeInMainWorld('steam', steam);

const layouts: LayoutsActions = {
  getLayouts: (game: GameName) => ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.GET_LAYOUTS, game),
  createLayout: (props: CreateLayoutProps) =>
    ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.CREATE_LAYOUT, props),
  deleteLayout: (filename: string, game: GameName) =>
    ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.DELETE_LAYOUT, filename, game),
  updateLayout: (filename: string, data: LayoutFile, game: GameName) =>
    ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.UPDATE_LAYOUT, filename, data, game),
  reorderLayouts: (filenames: string[], game: GameName) =>
    ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.REORDER_LAYOUTS, filenames, game),
  getLayoutsOrder: (game: GameName) =>
    ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.GET_LAYOUTS_ORDER, game),
  getActiveLayout: () => ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.GET_ACTIVE_LAYOUT),
  setActiveLayout: (filename: string, game: GameName) =>
    ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.SET_ACTIVE_LAYOUT, filename, game),
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
  servePreview: (folderPath: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.SERVE_PREVIEW, folderPath) as Promise<boolean>,
  stopServingPreview: () =>
    ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.STOP_SERVING_PREVIEW) as Promise<void>,
  generateThumbnail: () => ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.GENERATE_THUMBNAIL),
  getOverlayList: () =>
    ipcRenderer.invoke(IPC_CHANNELS.OVERLAY.GET_OVERLAY_LIST) as Promise<OverlayExtended[]>,
};

contextBridge.exposeInMainWorld('overlay', overlay);

const fs: FSActions = {
  read: (path: string) => ipcRenderer.invoke(IPC_CHANNELS.FS.READ, path),
};

contextBridge.exposeInMainWorld('fs', fs);
