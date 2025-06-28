import { useQuery } from '@tanstack/react-query';

export const getOverlays = () => {
  return window.electron.getOverlayList();
};

export const useOverlays = () => {
  return useQuery({
    queryKey: ['overlays'],
    queryFn: getOverlays,
  });
};
