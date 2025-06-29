import { LayoutsActions, SteamActions, WindowActions } from './ipc-bridge-types';

declare global {
  interface Window {
    actions: WindowActions;
    steam: SteamActions;
    layouts: LayoutsActions;
  }
}

export {};
