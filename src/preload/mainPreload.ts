// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload (Isolated World)
import { GameName } from "@/main/services/game-data/types/GameName";
import { ILayout } from "@/main/services/layoutService/schemas/layoutSchema";
import { contextBridge, ipcRenderer } from "electron";

function withTimeout<T>(channel: string, timeoutMs = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error("Main process did not respond in time."));
    }, timeoutMs);

    ipcRenderer.once(channel, (_, data) => {
      clearTimeout(timeout); // Clear the timeout if the main process responds
      resolve(data);
    });
  });
}

contextBridge.exposeInMainWorld("electron", {
  getOverlayList: async () => {
    ipcRenderer.send("overlay-list-renderer-to-main");
    return withTimeout("overlay-list-main-to-renderer");
  },
  openOverlaysFolder: async () => {
    ipcRenderer.send("open-overlays-folder-renderer-to-main");
    return withTimeout("open-overlays-folder-main-to-renderer");
  },
  getLayouts: async () => {
    ipcRenderer.send("get-layouts-renderer-to-main");
    return withTimeout("get-layouts-main-to-renderer");
  },
  createEmptyLayout: async (layoutName: string, layoutDescription: string) => {
    ipcRenderer.send(
      "create-empty-layout-renderer-to-main",
      layoutName,
      layoutDescription,
    );
    return withTimeout("create-empty-layout-main-to-renderer");
  },
  deleteLayout: async (fileName: string) => {
    ipcRenderer.send("delete-layout-renderer-to-main", fileName);
    return withTimeout("delete-layout-main-to-renderer");
  },
  modifyLayout: async (fileName: string, updatedData: Partial<ILayout>) => {
    ipcRenderer.send("modify-layout-renderer-to-main", fileName, updatedData);
    return withTimeout("modify-layout-main-to-renderer");
  },
  setActiveLayout: async (fileName: string) => {
    ipcRenderer.send("set-active-layout-renderer-to-main", fileName);
    return withTimeout("set-active-layout-main-to-renderer");
  },
  addOverlayToLayout: async (
    layoutFileName: string,
    overlayFolderName: string,
  ) => {
    ipcRenderer.send(
      "add-overlay-to-layout-renderer-to-main",
      layoutFileName,
      overlayFolderName,
    );
    return withTimeout("add-overlay-to-layout-main-to-renderer");
  },
  removeOverlayFromLayout: async (
    layoutFileName: string,
    overlayId: string,
  ) => {
    ipcRenderer.send(
      "remove-overlay-from-layout-renderer-to-main",
      layoutFileName,
      overlayId,
    );
    return withTimeout("remove-overlay-from-layout-main-to-renderer");
  },
  getSelectedGame: async (): Promise<GameName | null> => {
    ipcRenderer.send("get-selected-game-renderer-to-main");
    return withTimeout("get-selected-game-main-to-renderer");
  },
  setSelectedGame: async (gameName: GameName | null) => {
    ipcRenderer.send("set-selected-game-renderer-to-main", gameName);
    return withTimeout("set-selected-game-main-to-renderer");
  },
  getOverlaysLocked: async () => {
    ipcRenderer.send("get-overlays-locked-renderer-to-main");
    return withTimeout("get-overlays-locked-main-to-renderer");
  },
  setOverlaysLocked: async (locked: boolean) => {
    ipcRenderer.send("set-overlays-locked-renderer-to-main", locked);
    return withTimeout("set-overlays-locked-main-to-renderer");
  },
});

contextBridge.exposeInMainWorld("actions", {
  minimize: () => ipcRenderer.send("title-bar-message", "minimize"),
  restore: () => ipcRenderer.send("title-bar-message", "restore"),
  close: () => ipcRenderer.send("title-bar-message", "close"),
});
