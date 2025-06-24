// client.workshop.subscribe(itemId: bigint): Promise<void>
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const subscribeWorkshopItem = ({ item }: { item: bigint }) => {
  return window.steam.subscribeWorkshopItem(item);
};

export const useWorkshopSubscribeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: subscribeWorkshopItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["steam-workshop-subscribed-item-list"],
      });
    },
  });
};
