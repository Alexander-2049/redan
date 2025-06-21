import { contextBridge, ipcRenderer } from "electron";
import { GameName } from "@/main/services/game-data/types/game-name-schema";
import { ILayout } from "@/main/services/layout-service/schemas/layoutSchema";
import { IPC_CHANNELS } from "@/shared/ipc-channels";

contextBridge.exposeInMainWorld("electron", {
  getLayouts: () => ipcRenderer.invoke(IPC_CHANNELS.GET_LAYOUTS),
  createEmptyLayout: (name: string, description: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.CREATE_EMPTY_LAYOUT, name, description),
  deleteLayout: (fileName: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.DELETE_LAYOUT, fileName),
  modifyLayout: (fileName: string, data: Partial<ILayout>) =>
    ipcRenderer.invoke(IPC_CHANNELS.MODIFY_LAYOUT, fileName, data),
  setActiveLayout: (fileName: string) =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_ACTIVE_LAYOUT, fileName),
  addOverlayToLayout: (layoutFileName: string, overlayFolderName: string) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.ADD_OVERLAY_TO_LAYOUT,
      layoutFileName,
      overlayFolderName,
    ),
  removeOverlayFromLayout: (layoutFileName: string, overlayId: string) =>
    ipcRenderer.invoke(
      IPC_CHANNELS.REMOVE_OVERLAY_FROM_LAYOUT,
      layoutFileName,
      overlayId,
    ),
  getSelectedGame: () => ipcRenderer.invoke(IPC_CHANNELS.GET_SELECTED_GAME),
  setSelectedGame: (gameName: GameName | null) =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_SELECTED_GAME, gameName),
  getOverlaysLocked: () => ipcRenderer.invoke(IPC_CHANNELS.GET_OVERLAYS_LOCKED),
  setOverlaysLocked: (locked: boolean) =>
    ipcRenderer.invoke(IPC_CHANNELS.SET_OVERLAYS_LOCKED, locked),
  recordDemo: () => ipcRenderer.invoke(IPC_CHANNELS.RECORD_DEMO),
  stopRecordDemo: () => ipcRenderer.invoke(IPC_CHANNELS.STOP_RECORD_DEMO),
  isDebug: () => ipcRenderer.invoke(IPC_CHANNELS.IS_DEBUG),
  getOverlayList: () => ipcRenderer.invoke(IPC_CHANNELS.GET_OVERLAY_LIST),
  openOverlaysFolder: () =>
    ipcRenderer.invoke(IPC_CHANNELS.OPEN_OVERLAYS_FOLDER),
  getSteamWorkshopSubscribedItems: () =>
    ipcRenderer.invoke(IPC_CHANNELS.STEAM_GET_WORKSHOP_SUBSCRIBED_ITEMS),
  getAllSteamWorkshopItems: (page: number) =>
    ipcRenderer.invoke(IPC_CHANNELS.STEAM_GET_WORKSHOP_ALL_ITEMS, page),

  onLayoutModified: (callback: () => void) => {
    ipcRenderer.on(IPC_CHANNELS.LAYOUT_MODIFIED, () => callback());
  },
  removeLayoutModifiedListeners: () => {
    ipcRenderer.removeAllListeners(IPC_CHANNELS.LAYOUT_MODIFIED);
  },
  getGameDataShape: (game: GameName) =>
    ipcRenderer.invoke(IPC_CHANNELS.GET_GAME_DATA_SHAPE, game),
});

contextBridge.exposeInMainWorld("actions", {
  minimize: () => ipcRenderer.send("title-bar-message", "minimize"),
  restore: () => ipcRenderer.send("title-bar-message", "restore"),
  close: () => ipcRenderer.send("title-bar-message", "close"),
});
