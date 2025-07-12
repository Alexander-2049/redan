import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';

import { ScrollArea } from '../ui/scroll-area';

import { CreateLayoutButton } from './layout-selector/create-layout-button';
import { LayoutList } from './layout-selector/layout-list';
import { SearchHeader } from './layout-selector/search-header'; // Corrected import statement

import type { LayoutFile } from '@/shared/types/LayoutFile';

interface ExtendedLayoutFile extends LayoutFile {
  filename: string;
}

interface LayoutSelectorProps {
  layouts?: ExtendedLayoutFile[];
  activeLayoutFilename?: string; // New prop for active state
  handleCreateLayout: () => void;
  handleDeleteLayout: (filename: string) => void;
  handleRenameLayout: (filename: string, newTitle: string) => void;
  handleReorderLayouts: (filenames: string[]) => void;
}

export const LayoutSelector = (props: LayoutSelectorProps): ReactElement => {
  const [layoutsState, setLayoutsState] = useState<ExtendedLayoutFile[]>(props.layouts || []);
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sync internal state with props.layouts
  useEffect(() => {
    if (props.layouts) {
      // Only update if the actual order or content of layouts has changed
      const currentFilenames = layoutsState.map(l => l.filename);
      const newFilenames = props.layouts.map(l => l.filename);
      if (JSON.stringify(currentFilenames) !== JSON.stringify(newFilenames)) {
        setLayoutsState(props.layouts);
      } else {
        // If order is the same, check for content changes (e.g., title updates)
        const hasContentChanged = props.layouts.some((newLayout, index) => {
          const currentLayout = layoutsState[index];
          return (
            !currentLayout ||
            newLayout.title !== currentLayout.title ||
            newLayout.overlays.length !== currentLayout.overlays.length
          );
        });
        if (hasContentChanged) {
          setLayoutsState(props.layouts);
        }
      }
    }
  }, [props.layouts, layoutsState]);

  const filteredLayouts = layoutsState.filter(layout =>
    layout.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="bg-accent/50 flex h-full w-60 min-w-0 flex-col border-r">
      {/* Scrollable Content */}
      <div className="relative flex flex-1 flex-col overflow-hidden">
        <ScrollArea className="relative flex-1 overflow-y-auto">
          <div className="flex flex-col items-center space-y-2 pb-3">
            {/* Sticky Search Header */}
            <SearchHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
            <LayoutList
              layouts={filteredLayouts}
              activeLayoutFilename={props.activeLayoutFilename}
              handleDeleteLayout={props.handleDeleteLayout}
              handleRenameLayout={props.handleRenameLayout}
              handleReorderLayouts={props.handleReorderLayouts}
            />
            <CreateLayoutButton handleCreateLayout={props.handleCreateLayout} />
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
