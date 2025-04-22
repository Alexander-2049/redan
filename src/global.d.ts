import { ICreateNewLayoutOutput } from "./main/services/layoutService/layoutHandler";
import { LayoutDataAndFilename } from "./main/services/layoutService/schemas/layoutSchema";
import { IOverlay } from "./shared/types/IOverlay";

interface MainWindowAPI {
  getOverlayList: () => Promise<IOverlay[]>;
  openOverlaysFolder: () => Promise<boolean>;
  getLayouts: () => Promise<LayoutDataAndFilename[]>;
  createEmptyLayout: (
    layoutName: string,
    layoutDescription: string,
  ) => Promise<ICreateNewLayoutOutput>;
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
