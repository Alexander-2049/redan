import { useQuery } from '@tanstack/react-query';

export const getSelectedGame = () => {
  return window.electron.getSelectedGame();
};

export const useSelectedGame = () => {
  return useQuery({
    queryKey: ['selected-game'],
    queryFn: getSelectedGame,
  });
};
