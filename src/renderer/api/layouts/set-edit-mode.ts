import { useMutation, useQueryClient } from '@tanstack/react-query';

export const setEditMode = (isEditMode: boolean) => {
  return window.layouts.setEditMode(isEditMode);
};

export const useSetEditMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isEditMode }: { isEditMode: boolean }) => setEditMode(isEditMode),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['edit-mode'] });
    },
  });
};
