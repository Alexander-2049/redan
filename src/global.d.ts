import { IOverlay } from "./shared/types/IOverlay";

interface MainWindowAPI {
  getOverlayList: () => Promise<IOverlay[]>;
}
interface WindowAction {
  minimize: () => void;
  restore: () => void;
  close: () => void;
}

declare global {
  interface Window {
    electron: MainWindowAPI;
    actions: WindowAction;
  }
}

export {};
