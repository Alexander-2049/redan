import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GameName } from '@/main/shared/types/GameName';

export const deleteLayout = (filename: string, game: GameName) => {
  return window.layouts.deleteLayout(filename, game);
};

export const useDeleteLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ filename, game }: { filename: string; game: GameName }) =>
      deleteLayout(filename, game),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['layouts'] });
      void queryClient.invalidateQueries({ queryKey: ['active-layout'] });
    },
  });
};
