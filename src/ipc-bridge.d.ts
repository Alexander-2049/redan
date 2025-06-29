import { SteamActions, WindowActions } from './ipc-bridge-types';

declare global {
  interface Window {
    actions: WindowActions;
    steam: SteamActions;
  }
}

export {};
