// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

// Preload (Isolated World)
import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electron", {
  getOverlayList: async () => {
    ipcRenderer.send("overlay-list-renderer-to-main");
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error("Main process did not respond in time."));
      }, 5000);

      ipcRenderer.once("overlay-list-main-to-renderer", (_, data) => {
        clearTimeout(timeout); // Clear the timeout if the main process responds
        resolve(data);
      });
    });
  },
});

contextBridge.exposeInMainWorld("actions", {
  minimize: () => ipcRenderer.send("title-bar-message", "minimize"),
  restore: () => ipcRenderer.send("title-bar-message", "restore"),
  close: () => ipcRenderer.send("title-bar-message", "close"),
});
