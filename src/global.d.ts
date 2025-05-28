import {
  ICreateNewLayoutResponse,
  IResponse,
  IModifyLayoutResponse,
} from "./main/services/layoutService/layoutHandler";
import {
  ILayout,
  ILayoutDataAndFilename,
} from "./main/services/layoutService/schemas/layoutSchema";
import { IOverlayAndFolderName } from "./shared/types/IOverlayAndFolderName";

interface MainWindowAPI {
  getOverlayList: () => Promise<IOverlayAndFolderName[]>;
  openOverlaysFolder: () => Promise<boolean>;
  getLayouts: () => Promise<ILayoutDataAndFilename[]>;
  createEmptyLayout: (
    layoutName: string,
    layoutDescription: string,
  ) => Promise<ICreateNewLayoutResponse>;
  deleteLayout: (fileName: string) => Promise<IResponse>;
  modifyLayout: (
    fileName: string,
    updatedData: Partial<ILayout>,
  ) => Promise<IModifyLayoutResponse>;
  setActiveLayout: (fileName: string) => Promise<IResponse>;
  addOverlayToLayout: (
    layoutFileName: string,
    overlayFolderName: string,
  ) => Promise<IResponse>;
  removeOverlayFromLayout: (
    layoutFileName: string,
    overlayId: string,
  ) => Promise<IResponse>;
  getSelectedGame: () => Promise<GameName | null>;
  setSelectedGame: (gameName: GameName | null) => Promise<IResponse>;
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
