import { BrowserWindow } from 'electron';

export type IpcMessageHandler = {
  channel: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handler: (window: BrowserWindow, props?: Record<string, any>) => void | Promise<void>;
};
