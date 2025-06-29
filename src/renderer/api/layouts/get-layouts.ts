import { useQuery } from '@tanstack/react-query';

export const getLayouts = () => {
  return window.layouts.getLayouts();
};

export const useLayouts = () => {
  return useQuery({
    queryKey: ['layouts'],
    queryFn: getLayouts,
    refetchOnWindowFocus: true,
  });
};
