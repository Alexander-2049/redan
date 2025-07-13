import { useQuery } from '@tanstack/react-query';

export const getActiveLayout = () => {
  return window.layouts.getActiveLayout();
};

export const useActiveLayout = () => {
  return useQuery({
    queryKey: ['active-layout'],
    queryFn: getActiveLayout,
  });
};
