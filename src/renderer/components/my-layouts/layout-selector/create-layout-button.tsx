import { Plus } from 'lucide-react';

import { HTTP_SERVER_PORT } from '@/shared/constants';

interface CreateLayoutButtonProps {
  handleCreateLayout: () => void;
}

export const CreateLayoutButton = ({ handleCreateLayout }: CreateLayoutButtonProps) => {
  return (
    <button
      onClick={handleCreateLayout}
      className="group bg-primary/1 hover:bg-primary/10 border-primary/30 hover:border-primary/50 flex min-h-[120px] w-56 min-w-0 flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-center transition-all duration-200 hover:scale-[1.02] hover:cursor-pointer active:scale-[0.98]"
    >
      <div className="flex min-w-0 items-center gap-2">
        <Plus className="text-primary/70 group-hover:text-primary h-4 w-4 shrink-0 transition-colors" />
        <span className="text-primary/70 group-hover:text-primary truncate text-sm font-medium transition-colors">
          Create New Layout
        </span>
      </div>
      <img
        className="h-5 shrink-0 opacity-60 transition-opacity group-hover:opacity-80"
        src={`http://localhost:${HTTP_SERVER_PORT}/assets/images/logo-iracing.png`}
        alt="iRacing Logo"
      />
    </button>
  );
};
