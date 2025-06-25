// client.workshop.unsubscribe(itemId: bigint): Promise<void>
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface Props {
  item: bigint;
}

export const unsubscribeWorkshopItem = ({ item }: Props) => {
  return window.steam.subscribeWorkshopItem(item);
};

export const useWorkshopUnsubscribeItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: unsubscribeWorkshopItem,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["steam-workshop-subscribed-item-list"],
      });
    },
  });
};
