import { useQuery } from '@tanstack/react-query';

import { GameName } from '@/main/shared/types/GameName';

export const getLayoutsOrder = (game: GameName) => {
  return window.layouts.getLayoutsOrder(game);
};

export const useLayoutsOrder = (game: GameName) => {
  return useQuery({
    queryKey: ['layouts-order', game],
    queryFn: () => getLayoutsOrder(game),
  });
};
