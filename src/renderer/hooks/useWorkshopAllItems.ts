import { useInfiniteQuery } from '@tanstack/react-query';

import { API } from '../api';

export const useWorkshopAllItems = (startPage = 1) => {
  return useInfiniteQuery({
    queryKey: ['steam-workshop-all-items'],
    queryFn: async ({ pageParam = startPage }) => {
      const response = await API.steam.workshop.getWorkshopAllItems(pageParam);
      return response?.items ?? [];
    },
    initialPageParam: startPage,
    getNextPageParam: (lastPage, allPages) => {
      if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
    refetchOnWindowFocus: false,
  });
};
