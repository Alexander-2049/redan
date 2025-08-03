import { useQuery } from '@tanstack/react-query';

import { WorkshopItemsResult } from '@/shared/types/steam';

function getWorkshopItems(itemIds: string[] | bigint[]): Promise<WorkshopItemsResult | null> {
  if (itemIds.length === 0) return new Promise(res => res(null));
  return window.steam.workshop.getItems(itemIds);
}

export const useWorkshopItems = (itemIds: string[] | bigint[]) => {
  return useQuery({
    queryKey: [
      'steam-workshop-items',
      itemIds
        .map(n => {
          if (typeof n === 'bigint') return n.toString();
          else return n;
        })
        .join(''),
    ],
    queryFn: () => getWorkshopItems(itemIds),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // prevent refetching for 5 minutes
  });
};
