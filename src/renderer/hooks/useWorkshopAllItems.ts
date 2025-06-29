import { useInfiniteQuery } from '@tanstack/react-query';

import { API } from '../api';

export const useWorkshopAllItems = () => {
  return useInfiniteQuery({
    queryKey: ['steam-workshop-all-items'],
    queryFn: async ({ pageParam = 1 }) => {
      const response = await API.steam.workshop.getWorkshopAllItems(pageParam);
      if (!response) return [];
      return response.items;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      // Example logic, adjust according to your API's pagination
      if (lastPage.length === 0) return undefined;
      return allPages.length + 1;
    },
  });
};
