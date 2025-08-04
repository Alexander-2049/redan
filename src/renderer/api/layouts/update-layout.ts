import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GameName } from '@/main/shared/types/GameName';
import { LayoutFile } from '@/shared/types/LayoutFile';

export const updateLayout = (filename: string, data: LayoutFile, game: GameName) => {
  return window.layouts.updateLayout(filename, data, game);
};

export const useUpdateLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      filename,
      data,
      game,
    }: {
      filename: string;
      data: LayoutFile;
      game: GameName;
    }) => updateLayout(filename, data, game),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['layouts'] });
      void queryClient.invalidateQueries({ queryKey: ['active-layout'] });
    },
  });
};
