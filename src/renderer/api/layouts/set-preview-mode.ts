import { useMutation, useQueryClient } from '@tanstack/react-query';

export const setPreviewMode = (isPreviewMode: boolean) => {
  return window.layouts.setPreviewMode(isPreviewMode);
};

export const useSetPreviewMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ isPreviewMode }: { isPreviewMode: boolean }) => setPreviewMode(isPreviewMode),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['preview-mode'] });
    },
  });
};
