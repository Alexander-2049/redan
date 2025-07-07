import { LayoutFile } from './main/shared/types/LayoutFile';
import { OverlayManifestFile } from './shared/types/OverlayManifestFile';
import { SettingsMap } from './shared/types/SettingValue';
import {
  DownloadInfo,
  InstallInfo,
  UgcItemVisibility,
  UgcUpdate,
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
  getMyItems: (page: number) => Promise<WorkshopPaginatedResult | null>;
  downloadItem: (item: bigint) => Promise<boolean>;
  downloadInfo: (item: bigint) => Promise<DownloadInfo | null>;
  getInstallInfo: (item: bigint) => Promise<InstallInfo | null>;
  openInSteamClient: (workshopId: bigint | number | string) => void;
  create: () => Promise<bigint | null>;
  updateItem: (
    itemId: bigint,
    props: UgcUpdate,
    visibility?: UgcItemVisibility,
  ) => Promise<bigint | null>;
}

export interface SteamActions {
  isOnline: () => Promise<boolean>;
  workshop: SteamWorkshopActions;
}

export interface LayoutsActions {
  getLayouts: () => Promise<LayoutFile[]>;
}

export interface OverlayActions {
  open: (url: string, manifest: OverlayManifestFile) => Promise<void>;
  close: () => Promise<void>;
  updateEditMode: (mode: boolean) => Promise<void>;
  updateSettings: (settings: SettingsMap[]) => Promise<void>;
}
