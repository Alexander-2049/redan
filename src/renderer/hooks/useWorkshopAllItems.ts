import { useQuery } from '@tanstack/react-query';

import { API } from '../api';

export const useWorkshopPage = (page: number) => {
  return useQuery({
    queryKey: ['steam-workshop-all-items', page],
    queryFn: () => API.steam.workshop.getWorkshopAllItems(page),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // prevent refetching for 5 minutes
  });
};
