import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface ISetOverlaysLockedProps {
  isLocked: boolean;
}

export const setOverlaysLocked = ({ isLocked }: ISetOverlaysLockedProps) => {
  window.electron.setIsPreview(!isLocked);
  return window.electron.setOverlaysLocked(isLocked);
};

export const useSetOverlaysLocked = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setOverlaysLocked,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['overlays-lock'] });
    },
  });
};
