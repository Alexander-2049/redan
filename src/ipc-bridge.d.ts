import {
  FSActions,
  LayoutsActions,
  OverlayActions,
  SteamActions,
  WindowActions,
} from './ipc-bridge-types';

declare global {
  interface Window {
    actions: WindowActions;
    steam: SteamActions;
    layouts: LayoutsActions;
    overlay: OverlayActions;
    fs: FSActions;
  }
}

export {};
