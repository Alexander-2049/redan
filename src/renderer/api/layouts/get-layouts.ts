import { useQuery } from '@tanstack/react-query';

import { GameName } from '@/main/shared/types/GameName';

export const getLayouts = ({ queryKey }: { queryKey: [string, GameName] }) => {
  const [, game] = queryKey;
  return window.layouts.getLayouts(game);
};

export const useLayouts = (game: GameName) => {
  return useQuery({
    queryKey: ['layouts', game],
    queryFn: getLayouts,
    refetchOnWindowFocus: true,
  });
};
