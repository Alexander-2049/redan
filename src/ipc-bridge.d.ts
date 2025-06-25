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
import { GameName } from "./main/services/game-data/types/game-name-schema";
import {
  DownloadInfo,
  InstallInfo,
  WorkshopItemQueryConfig,
  WorkshopPaginatedResult,
} from "./shared/schemas/steamworks-schemas";
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
  setOverlaysLocked: (locked: boolean) => Promise<DefaultResponse>;
  recordDemo: () => Promise<DefaultResponse>;
  stopRecordDemo: () => Promise<DefaultResponse>;
  isDebug: () => Promise<boolean>;
  getSteamWorkshopSubscribedItems: () => Promise<string[]>;
  getAllSteamWorkshopItems: (page: number) => Promise<any | null>;
  onLayoutModified: (callback: () => void) => void;
  removeLayoutModifiedListeners: () => void;
  getGameDataShape: (game: GameName) => Promise<string>;
  isPreview: () => Promise<boolean>;
  setIsPreview: (isPreview: boolean) => Promise<boolean>;
}

interface WindowAction {
  minimize: () => void;
  restore: () => void;
  close: () => void;
}

interface SteamAction {
  isSteamOnline: () => Promise<boolean>;
  fetchWorkshopItems: (
    page: number,
    queryConfig?: WorkshopItemQueryConfig,
  ) => Promise<WorkshopPaginatedResult>;
  workshopSubscribe: (item: bigint) => Promise<void>;
  workshopUnsubscribe: (item: bigint) => Promise<void>;
  workshopGetSubscribedItems: () => Promise<bigint[]>;
  workshopDownloadItem: (item: bigint) => Promise<boolean>;
  workshopDownloadInfo: (item: bigint) => Promise<DownloadInfo | null>;
  workshopGetInstallInfo: (item: bigint) => Promise<InstallInfo | null>;
}

declare global {
  interface Window {
    electron: MainWindowAPI;
    actions: WindowAction;
    steam: SteamAction;
  }
}

export {};
