import { useQuery } from "@tanstack/react-query";

export const getLayouts = () => {
  return window.electron.getLayouts();
};

export const useLayouts = () => {
  return useQuery({
    queryKey: ["layouts"],
    queryFn: getLayouts,
  });
};
