import { useQuery } from '@tanstack/react-query';

export const getCommitCount = () => {
  return window.app.getCommitCount();
};

export const useCommitCount = () => {
  return useQuery({
    queryKey: ['app-commit-count'],
    queryFn: getCommitCount,
  });
};
