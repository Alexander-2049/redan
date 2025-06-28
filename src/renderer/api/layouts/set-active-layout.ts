import { ILayoutDataAndFilename } from "@/main/_/layout-service/schemas/layoutSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const setActiveLayout = ({ fileName }: { fileName: string }) => {
  return window.electron.setActiveLayout(fileName);
};

export const useSetActiveLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setActiveLayout,
    onMutate: async ({ fileName }) => {
      await queryClient.cancelQueries({ queryKey: ["layouts"] });

      const previousLayouts = queryClient.getQueryData(["layouts"]);

      queryClient.setQueryData(["layouts"], (old: ILayoutDataAndFilename[]) =>
        old?.map((layout: ILayoutDataAndFilename) => {
          if (layout.filename === fileName) {
            return {
              ...layout,
              data: {
                ...layout.data,
                active: true,
              },
            };
          } else {
            return {
              ...layout,
              data: {
                ...layout.data,
                active: false,
              },
            };
          }
        }),
      );

      return { previousLayouts };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["layouts"], context?.previousLayouts);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },
  });
};
