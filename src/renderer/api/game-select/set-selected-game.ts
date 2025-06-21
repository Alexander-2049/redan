import { GameName } from "@/main/services/game-data/types/game-name-schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
      queryClient.invalidateQueries({ queryKey: ["selected-game"] });
    },
  });
};
