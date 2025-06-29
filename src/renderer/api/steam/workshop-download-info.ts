import { useQuery } from '@tanstack/react-query';

export const fetchWorkshopDownloadInfo = async (itemId: bigint) => {
  return window.steam.workshop.downloadInfo(itemId);
};

export const useWorkshopDownloadInfo = (itemId: bigint | null) => {
  return useQuery({
    queryKey: ['steam-workshop-download-info', itemId?.toString()],
    queryFn: () => {
      if (itemId) return fetchWorkshopDownloadInfo(itemId);
      else return null;
    },
    enabled: !!itemId, // Optional: prevent running with invalid id
  });
};
