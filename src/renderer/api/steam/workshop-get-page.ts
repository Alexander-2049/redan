import { useQuery } from '@tanstack/react-query';

import { WorkshopItemQueryConfig, WorkshopPaginatedResult } from '@/shared/types/steam';

function getWorkshopAllItems(
  page = 1,
  queryConfig?: WorkshopItemQueryConfig,
): Promise<WorkshopPaginatedResult | null> {
  return window.steam.workshop.getWorkshopAllItems(page, {
    matchAnyTag: true,
    requiredTags: [],
    ...queryConfig,
  });
}

export const useWorkshopPage = (page: number) => {
  return useQuery({
    queryKey: ['steam-workshop-all-items', page],
    queryFn: () => getWorkshopAllItems(page),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // prevent refetching for 5 minutes
  });
};
