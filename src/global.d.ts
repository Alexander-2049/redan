import { ILayout } from "./main/services/layoutService/schemas/layoutSchema";
import { IOverlay } from "./shared/types/IOverlay";

interface MainWindowAPI {
  getOverlayList: () => Promise<IOverlay[]>;
  openOverlaysFolder: () => Promise<boolean>;
  getLayouts: () => Promise<ILayout[]>;
  createEmptyLayout: (filename: string) => Promise<ILayout[]>;
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
