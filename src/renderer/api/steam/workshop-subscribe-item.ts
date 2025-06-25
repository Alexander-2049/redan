import { useMutation, useQueryClient } from "@tanstack/react-query";

export const subscribeWorkshopItem = ({ item }: { item: bigint }) => {
  return window.steam.workshopSubscribe(item);
};

export const useWorkshopSubscribeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: subscribeWorkshopItem,

    // Optimistic update
    onMutate: async ({ item }) => {
      await queryClient.cancelQueries({
        queryKey: ["steam-workshop-subscribed-item-list"],
      });

      const previousItems = queryClient.getQueryData<bigint[]>([
        "steam-workshop-subscribed-item-list",
      ]);

      queryClient.setQueryData<bigint[]>(
        ["steam-workshop-subscribed-item-list"],
        (old = []) => {
          if (!old.includes(item)) {
            return [...old, item];
          }
          return old;
        },
      );

      return { previousItems };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(
          ["steam-workshop-subscribed-item-list"],
          context.previousItems,
        );
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["steam-workshop-subscribed-item-list"],
      });
    },
  });
};
