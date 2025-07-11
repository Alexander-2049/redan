import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';

import { HTTP_SERVER_PORT } from '@/shared/constants';
import { LayoutFile } from '@/shared/types/LayoutFile';

interface LayoutSelectorProps {
  layouts?: (LayoutFile & { filename: string })[];
  handleCreateLayout: () => void;
}

export const LayoutSelector = (props: LayoutSelectorProps) => {
  return (
    <div className="bg-accent h-full w-60 border-r-1">
      <div className="bg-background flex h-13 flex-row gap-2 border-b-1 p-2">
        <Input className="bg-background h-full" type="text" placeholder="Search..." />
      </div>
      <ScrollArea className="h-full w-full shrink-0 grow p-2">
        {props.layouts?.map(layout => <div key={layout.filename}>{layout.filename}</div>)}
        <button
          onClick={props.handleCreateLayout}
          className="hover:bg-accent-foreground/5 hover:border-accent-foreground/30 bg-card flex h-30 w-full flex-col items-center justify-center gap-1 rounded-xl border-2 transition-all hover:cursor-pointer hover:border-4"
        >
          <span>Create new Layout</span>
          <img
            className="h-6"
            src={`http://localhost:${HTTP_SERVER_PORT}/assets/images/logo-iracing.png`}
          />
        </button>
      </ScrollArea>
    </div>
  );
};
