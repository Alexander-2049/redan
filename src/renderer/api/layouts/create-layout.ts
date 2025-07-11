import { useMutation, useQueryClient } from '@tanstack/react-query';

import type { CreateLayoutProps } from '@/shared/types/CreateLayoutProps';

export const createLayout = (props: CreateLayoutProps) => {
  return window.layouts.createLayout(props);
};

export const useCreateLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLayout,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['layouts'] });
    },
  });
};
