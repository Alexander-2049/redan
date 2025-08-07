import { useQuery } from '@tanstack/react-query';

export const isEditMode = () => {
  return window.layouts.isEditMode();
};

export const useIsEditMode = () => {
  return useQuery({
    queryKey: ['edit-mode'],
    queryFn: isEditMode,
    refetchOnWindowFocus: true,
  });
};

// isEditMode: () => ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.GET_EDIT_MODE),
// setEditMode: (isEditMode: boolean) =>
//   ipcRenderer.invoke(IPC_CHANNELS.LAYOUTS.SET_EDIT_MODE, isEditMode),
