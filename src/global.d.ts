import {
  ICreateNewLayoutResponse,
  IDeleteLayoutResponse,
  IModifyLayoutResponse,
} from "./main/services/layoutService/layoutHandler";
import {
  ILayout,
  LayoutDataAndFilename,
} from "./main/services/layoutService/schemas/layoutSchema";
import { IOverlayAndFolderName } from "./shared/types/IOverlayAndFolderName";

interface MainWindowAPI {
  getOverlayList: () => Promise<IOverlayAndFolderName[]>;
  openOverlaysFolder: () => Promise<boolean>;
  getLayouts: () => Promise<LayoutDataAndFilename[]>;
  createEmptyLayout: (
    layoutName: string,
    layoutDescription: string,
  ) => Promise<ICreateNewLayoutResponse>;
  deleteLayout: (fileName: string) => Promise<IDeleteLayoutResponse>;
  modifyLayout: (
    fileName: string,
    updatedData: Partial<ILayout>,
  ) => Promise<IModifyLayoutResponse>;
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
