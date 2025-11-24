import { useQuery } from '@tanstack/react-query';

export const getVersion = () => {
  return window.app.getVersion();
};

export const useVersion = () => {
  return useQuery({
    queryKey: ['app-version'],
    queryFn: getVersion,
  });
};
