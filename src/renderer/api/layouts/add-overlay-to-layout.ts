import { useMutation, useQueryClient } from '@tanstack/react-query';

export interface IAddOverlayToLayoutProps {
  layoutFileName: string;
  overlayFolderName: string;
}

export const addOverlayToLayout = ({
  layoutFileName,
  overlayFolderName,
}: IAddOverlayToLayoutProps) => {
  return window.electron.addOverlayToLayout(layoutFileName, overlayFolderName);
};

export const useAddOverlayToLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOverlayToLayout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['layouts'] });
    },
  });
};
