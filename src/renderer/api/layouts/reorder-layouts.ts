import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GameName } from '@/main/shared/types/GameName';

export const reorderLayouts = (filenames: string[], game: GameName) => {
  return window.layouts.reorderLayouts(filenames, game);
};

export const useReorderLayouts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ filenames, game }: { filenames: string[]; game: GameName }) =>
      reorderLayouts(filenames, game),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['layouts-order'] });
    },
  });
};
