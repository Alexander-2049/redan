import { useQuery } from '@tanstack/react-query';

export const getOverlayList = () => {
  return window.overlay.getOverlayList();
};

export const useOverlayList = () => {
  return useQuery({
    queryKey: ['overlayList'],
    queryFn: getOverlayList,
    refetchOnWindowFocus: true,
  });
};
