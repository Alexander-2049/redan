import { useQuery } from '@tanstack/react-query';

export const getSubscribedItems = () => {
  return window.steam.workshopGetSubscribedItems();
};

export const useWorkshopSubscribedItems = () => {
  return useQuery({
    queryKey: ['steam-workshop-subscribed-item-list'],
    queryFn: getSubscribedItems,
  });
};
