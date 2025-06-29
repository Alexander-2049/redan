import { useQuery } from '@tanstack/react-query';

export const isSteamOnline = () => {
  return window.steam.isOnline();
};

export const useSteamOnline = () => {
  return useQuery({
    queryKey: ['steam-online'],
    queryFn: isSteamOnline,
  });
};
