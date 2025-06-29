import { useMutation, useQueryClient } from '@tanstack/react-query';

interface Props {
  item: bigint;
}

export const unsubscribeWorkshopItem = ({ item }: Props) => {
  return window.steam.workshop.unsubscribe(item);
};

export const useWorkshopUnsubscribeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: unsubscribeWorkshopItem,

    onMutate: async ({ item }) => {
      await queryClient.cancelQueries({
        queryKey: ['steam-workshop-subscribed-item-list'],
      });

      const previousItems = queryClient.getQueryData<bigint[]>([
        'steam-workshop-subscribed-item-list',
      ]);

      queryClient.setQueryData<bigint[]>(['steam-workshop-subscribed-item-list'], (old = []) =>
        old.filter(i => i !== item),
      );

      return { previousItems };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(['steam-workshop-subscribed-item-list'], context.previousItems);
      }
    },

    onSettled: () => {
      void queryClient.invalidateQueries({
        queryKey: ['steam-workshop-subscribed-item-list'],
      });
    },
  });
};
