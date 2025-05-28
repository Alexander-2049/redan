import { useQuery } from "@tanstack/react-query";

export const getOverlaysLocked = () => {
  return window.electron.getOverlaysLocked();
};

export const useOverlaysLocked = () => {
  return useQuery({
    queryKey: ["overlays-lock"],
    queryFn: getOverlaysLocked,
  });
};
