import { useMutation, useQueryClient } from '@tanstack/react-query';

export const workshopDownloadItem = ({ itemId }: { itemId: bigint }) => {
  return window.steam.workshopDownloadItem(itemId);
};

export const useWorkshopDownloadItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: workshopDownloadItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['steam-workshop-download-info'],
      });
    },
  });
};
