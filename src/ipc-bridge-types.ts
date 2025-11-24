import { GameName } from './main/shared/types/GameName';
import { CreateLayoutProps } from './shared/types/CreateLayoutProps';
import { LayoutConfig } from './shared/types/LayoutConfig';
import { LayoutFile } from './shared/types/LayoutFile';
import { OverlayExtended } from './shared/types/OverlayExtended';
import { OverlayManifestFile } from './shared/types/OverlayManifestFile';
import { SettingsMap } from './shared/types/SettingValue';
import {
  DownloadInfo,
  InstallInfo,
  UgcItemVisibility,
  UgcUpdate,
  WorkshopItemQueryConfig,
  WorkshopItemsResult,
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
  getAllItems: (
    page: number,
    queryConfig: WorkshopItemQueryConfig,
  ) => Promise<WorkshopPaginatedResult | null>;
  getSubscribedItems: () => Promise<bigint[]>;
  getMyPublishedItems: (page: number) => Promise<WorkshopPaginatedResult | null>;
  downloadItem: (item: bigint) => Promise<boolean>;
  downloadInfo: (item: bigint) => Promise<DownloadInfo | null>;
  getInstallInfo: (item: bigint) => Promise<InstallInfo | null>;
  openInSteamClient: (workshopId: bigint | number | string) => void;
  openInSteamClientUploadedFiles: () => void;
  create: (props: UgcUpdate, visibility?: UgcItemVisibility) => Promise<bigint | null>;
  updateItem: (
    itemId: bigint,
    props: UgcUpdate,
    visibility?: UgcItemVisibility,
  ) => Promise<bigint | null>;
  getItems: (itemIds: string[] | bigint[]) => Promise<WorkshopItemsResult | null>;
}

export interface SteamActions {
  isOnline: () => Promise<boolean>;
  workshop: SteamWorkshopActions;
}

export interface LayoutsActions {
  getLayouts: (game: GameName) => Promise<(LayoutFile & { filename: string })[]>;
  createLayout: (props: CreateLayoutProps) => Promise<boolean>;
  deleteLayout: (filename: string, game: GameName) => Promise<void>;
  updateLayout: (filename: string, data: LayoutFile, game: GameName) => Promise<void>;
  getLayoutsOrder: (game: GameName) => Promise<string[]>;
  reorderLayouts: (filenames: string[], game: GameName) => Promise<void>;
  setActiveLayout: (filename: string, game: GameName) => Promise<void>;
  getActiveLayout: () => Promise<{ config: LayoutConfig; data: LayoutFile } | null>;
  isEditMode: () => Promise<boolean>;
  setEditMode: (isEditMode: boolean) => Promise<boolean>;
  isPreviewMode: () => Promise<boolean>;
  setPreviewMode: (isPreviewMode: boolean) => Promise<boolean>;
}

export interface OverlayActions {
  open: (url: string, manifest: OverlayManifestFile) => Promise<void>;
  close: () => Promise<void>;
  updateEditMode: (mode: boolean) => Promise<void>;
  updateSettings: (settings: SettingsMap[]) => Promise<void>;
  servePreview: (folderPath: string) => Promise<boolean>;
  stopServingPreview: () => Promise<void>;
  generateThumbnail: () => Promise<string>;
  getOverlayList: () => Promise<OverlayExtended[]>;
}

export interface FSActions {
  read: (path: string) => Promise<string>;
}

export interface AppActions {
  getBuildVersion: () => Promise<string>;
  getBuildDate: () => Promise<string>;
  getCommitCount: () => Promise<number>;
  getVersion: () => Promise<string>;
}
