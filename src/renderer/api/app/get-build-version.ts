import { useQuery } from '@tanstack/react-query';

export const getBuildVersion = () => {
  return window.app.getBuildVersion();
};

export const useBuildVersion = () => {
  return useQuery({
    queryKey: ['app-build-version'],
    queryFn: getBuildVersion,
  });
};
