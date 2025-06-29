import { WorkshopItemQueryConfig, WorkshopPaginatedResult } from '@/shared/types/steam';

class Workshop {
  public static async getWorkshopAllItems(
    page = 1,
    queryConfig?: WorkshopItemQueryConfig,
  ): Promise<WorkshopPaginatedResult | null> {
    return window.steam.getWorkshopAllItems(page, {
      matchAnyTag: true,
      requiredTags: [],
      ...queryConfig,
    });
  }
}

export class Steam {
  public static workshop = Workshop;
}
