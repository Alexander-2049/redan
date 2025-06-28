import { useMutation, useQueryClient } from '@tanstack/react-query';

import { ILayoutDataAndFilename } from '@/main/_/layout-service/schemas/layoutSchema';

export const deleteLayout = ({ fileName }: { fileName: string }) => {
  return window.electron.deleteLayout(fileName);
};

export const useDeleteLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLayout,
    onMutate: async ({ fileName }) => {
      await queryClient.cancelQueries({ queryKey: ['layouts'] });

      const previousLayouts = queryClient.getQueryData(['layouts']);

      queryClient.setQueryData(['layouts'], (old: ILayoutDataAndFilename[]) =>
        old?.filter((layout: ILayoutDataAndFilename) => layout.filename !== fileName),
      );

      return { previousLayouts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['layouts'], context?.previousLayouts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['layouts'] });
    },
  });
};
