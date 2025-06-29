import { LayoutFile } from './main/shared/types/LayoutFile';
import {
  DownloadInfo,
  InstallInfo,
  WorkshopItemQueryConfig,
  WorkshopPaginatedResult,
} from './shared/types/steam';

export interface WindowActions {
  minimize: () => void;
  restore: () => void;
  close: () => void;
}

export interface SteamWorkshopActions {
  subscribe: (item: bigint) => Promise<void>;
  unsubscribe: (item: bigint) => Promise<void>;
  getWorkshopAllItems: (
    page: number,
    queryConfig: WorkshopItemQueryConfig,
  ) => Promise<WorkshopPaginatedResult | null>;
  getSubscribedItems: () => Promise<bigint[]>;
  downloadItem: (item: bigint) => Promise<boolean>;
  downloadInfo: (item: bigint) => Promise<DownloadInfo | null>;
  getInstallInfo: (item: bigint) => Promise<InstallInfo | null>;
  openInSteamClient: (workshopId: bigint | number | string) => void;
}

export interface SteamActions {
  isOnline: () => Promise<boolean>;
  workshop: SteamWorkshopActions;
}

export interface LayoutsActions {
  getLayouts: () => Promise<LayoutFile[]>;
}
