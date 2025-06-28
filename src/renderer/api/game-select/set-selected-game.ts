import { useMutation, useQueryClient } from '@tanstack/react-query';

import { GameName } from '@/main/_/game-data/types/game-name-schema';

export interface ISetSelectedGameProps {
  gameName: GameName | null;
}

export const setSelectedGame = ({ gameName }: ISetSelectedGameProps) => {
  return window.electron.setSelectedGame(gameName);
};

export const useSetSelectedGame = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setSelectedGame,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['selected-game'] });
    },
  });
};
