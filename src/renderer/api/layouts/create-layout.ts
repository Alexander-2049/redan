import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface ICreateLayoutProps {
  layoutName: string;
  layoutDescription: string;
}

export const createLayout = ({
  layoutName,
  layoutDescription,
}: ICreateLayoutProps) => {
  return window.electron.createEmptyLayout(layoutName, layoutDescription);
};

export const useCreateLayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLayout,
    onSuccess: () => {
      // Invalidate the "layouts" query to refetch the data
      queryClient.invalidateQueries({ queryKey: ["layouts"] });
    },
  });
};
