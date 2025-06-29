import { WorkshopItemQueryConfig, WorkshopPaginatedResult } from './shared/types/steam';

interface WindowAction {
  minimize: () => void;
  restore: () => void;
  close: () => void;
}

interface SteamAPI {
  getWorkshopAllItems: (
    page: number,
    queryConfig: WorkshopItemQueryConfig,
  ) => Promise<WorkshopPaginatedResult | null>;
}

declare global {
  interface Window {
    actions: WindowAction;
    steam: SteamAPI;
  }
}

export {};
