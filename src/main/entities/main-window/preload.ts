import { contextBridge, ipcRenderer } from 'electron/renderer';

import { IPC_CHANNELS } from '@/shared/ipc/channels';

contextBridge.exposeInMainWorld('actions', {
  minimize: () => ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.MINIMIZE),
  restore: () => ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.RESTORE),
  close: () => ipcRenderer.invoke(IPC_CHANNELS.ACTIONS.CLOSE),
});
