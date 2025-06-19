/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CreateNewLayoutResponse,
  DefaultResponse,
  ModifyLayoutResponse,
} from "./main/services/layout-service/layout-handler";
import {
  ILayout,
  ILayoutDataAndFilename,
} from "./main/services/layout-service/schemas/layoutSchema";
import { OverlayAndFolderName } from "./shared/types/overlay-and-folder-name";

interface MainWindowAPI {
  getOverlayList: () => Promise<OverlayAndFolderName[]>;
  openOverlaysFolder: () => Promise<boolean>;
  getLayouts: () => Promise<ILayoutDataAndFilename[]>;
  createEmptyLayout: (
    layoutName: string,
    layoutDescription: string,
  ) => Promise<CreateNewLayoutResponse>;
  deleteLayout: (fileName: string) => Promise<DefaultResponse>;
  modifyLayout: (
    fileName: string,
    updatedData: Partial<ILayout>,
  ) => Promise<ModifyLayoutResponse>;
  setActiveLayout: (fileName: string) => Promise<DefaultResponse>;
  addOverlayToLayout: (
    layoutFileName: string,
    overlayFolderName: string,
  ) => Promise<DefaultResponse>;
  removeOverlayFromLayout: (
    layoutFileName: string,
    overlayId: string,
  ) => Promise<DefaultResponse>;
  getSelectedGame: () => Promise<GameName | null>;
  setSelectedGame: (gameName: GameName | null) => Promise<DefaultResponse>;
  getOverlaysLocked: () => Promise<boolean>;
  setOverlaysLocked: (boolean) => Promise<DefaultResponse>;
  recordDemo: () => Promise<DefaultResponse>;
  stopRecordDemo: () => Promise<DefaultResponse>;
  isDebug: () => Promise<boolean>;
  ipcRenderer: {
    send: (channel: string, data: any) => void;
    on: (channel: string, callback: (event: any, data: any) => void) => void;
    removeAllListeners: (channel: string) => void;
  };
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
