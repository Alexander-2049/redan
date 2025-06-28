import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ILayout } from '@/main/_/layout-service/schemas/layoutSchema';

export interface IModifyLayoutProps {
  fileName: string;
  updatedData: Partial<ILayout>;
}

export const modifyLayout = ({ fileName, updatedData }: IModifyLayoutProps) => {
  return window.electron.modifyLayout(fileName, updatedData);
};

export const useModifyLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: modifyLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layouts'] });
    },
  });
};
