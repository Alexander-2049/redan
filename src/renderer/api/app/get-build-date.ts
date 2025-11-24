import { useQuery } from '@tanstack/react-query';

export const getBuildDate = () => {
  return window.app.getBuildDate();
};

export const useBuildDate = () => {
  return useQuery({
    queryKey: ['app-build-date'],
    queryFn: getBuildDate,
  });
};
