// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload (Isolated World)
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
  createEmptyLayout: async (filename: string) => {
    ipcRenderer.send("create-empty-layout-renderer-to-main", filename);
    return withTimeout("create-empty-layout-main-to-renderer");
  },
});

contextBridge.exposeInMainWorld("actions", {
  minimize: () => ipcRenderer.send("title-bar-message", "minimize"),
  restore: () => ipcRenderer.send("title-bar-message", "restore"),
  close: () => ipcRenderer.send("title-bar-message", "close"),
});
