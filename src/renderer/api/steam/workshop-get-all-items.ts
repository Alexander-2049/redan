// client.workshop.getAllItems()
// function workshop.getAllItems(page: number, queryType: workshop.UGCQueryType, itemType: workshop.UGCType, creatorAppId: number, consumerAppId: number, queryConfig?: workshop.WorkshopItemQueryConfig | undefined | null): Promise<workshop.WorkshopPaginatedResult>
import { WorkshopItemQueryConfig } from "@/shared/schemas/steamworks-schemas";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const fetchWorkshopItems = ({
  page,
}: {
  page: number;
  queryConfig?: WorkshopItemQueryConfig;
}) => {
  return window.steam.fetchWorkshopItems(page, {
    matchAnyTag: true,
    requiredTags: [],
  });
};

export const useWorkshopItems = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: fetchWorkshopItems,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["steam-workshop-fetch"],
      });
    },
  });
};
