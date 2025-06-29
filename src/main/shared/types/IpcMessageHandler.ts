import { BrowserWindow } from 'electron';

export type IpcMessageHandler = {
  channel: string;
  handler: (window: BrowserWindow) => void | Promise<void>;
};
