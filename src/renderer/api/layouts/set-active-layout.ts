import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GameName } from '@/main/shared/types/GameName';

export const setActiveLayout = (filename: string, game: GameName) => {
  return window.layouts.setActiveLayout(filename, game);
};

export const useSetActiveLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ filename, game }: { filename: string; game: GameName }) =>
      setActiveLayout(filename, game),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['active-layout'] });
    },
  });
};
