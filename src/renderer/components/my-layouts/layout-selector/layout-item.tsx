import { Trash2, Pencil } from 'lucide-react';
import { useState } from 'react';
import type React from 'react';
import type { ReactElement } from 'react';

import { Button } from '../../ui/button';
import { Input } from '../../ui/input';

import { cn } from '@/renderer/lib/utils'; // Assuming cn utility is available
import type { LayoutFile } from '@/shared/types/LayoutFile';

interface ExtendedLayoutFile extends LayoutFile {
  filename: string;
}

interface LayoutItemProps {
  layout: ExtendedLayoutFile;
  index: number;
  isActive: boolean; // New prop for active state
  draggedItemIndex: number | null;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, index: number) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>, index: number) => void; // Simplified for direct swap
  onDrop: (e: React.DragEvent<HTMLDivElement>, index: number) => void; // Simplified for direct swap
  onDragEnd: () => void;
  handleDeleteLayout: (filename: string) => void;
  handleRenameLayout: (filename: string, newTitle: string) => void;
  onSelect: (filename: string) => void;
}

export const LayoutItem = ({
  layout,
  index,
  isActive,
  draggedItemIndex,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
  handleDeleteLayout,
  handleRenameLayout,
  onSelect,
}: LayoutItemProps): ReactElement => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(layout.title);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedTitle(e.target.value);
  };

  const handleSaveTitle = () => {
    if (editedTitle.trim() !== '' && editedTitle !== layout.title) {
      handleRenameLayout(layout.filename, editedTitle.trim());
    }
    setIsEditingTitle(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveTitle();
    } else if (e.key === 'Escape') {
      setEditedTitle(layout.title); // Revert to original title
      setIsEditingTitle(false);
    }
  };

  return (
    <div
      draggable={!isEditingTitle} // disable drag while editing to be extra safe
      onMouseDown={e => {
        const target = e.target as HTMLElement;
        if (target.closest('input, textarea, [contenteditable="true"]')) {
          e.stopPropagation(); // prevent drag initiation
        }
      }}
      onDragStart={e => {
        onDragStart(e, index);
      }}
      onDragOver={e => onDragOver(e, index)}
      onDrop={e => onDrop(e, index)}
      onDragEnd={onDragEnd}
      onClick={e => {
        const target = e.target as HTMLElement;
        if (target.closest('input, textarea, [contenteditable="true"]')) {
          return;
        }
        onSelect(layout.filename);
      }}
      className={cn(
        'group bg-card/80 hover:bg-card border-border/50 hover:border-border flex min-h-[120px] w-56 min-w-0 flex-col items-stretch justify-between gap-2 rounded-lg border p-3 text-center transition-all duration-200 hover:shadow-sm',
        !isEditingTitle && 'hover:scale-[1.02] hover:cursor-pointer active:scale-[0.98]',
        draggedItemIndex === index && 'border-dashed opacity-50',
        isActive && 'border-primary ring-primary/50 ring-2',
      )}
    >
      {/* Title and Actions */}
      <div className="relative flex w-full min-w-0 items-center">
        {isEditingTitle ? (
          <Input
            value={editedTitle}
            onChange={handleTitleChange}
            onBlur={handleSaveTitle}
            onKeyDown={handleKeyDown}
            autoFocus={true}
            className="text-foreground/90 h-8 flex-1 text-sm font-medium"
          />
        ) : (
          <div
            className={cn(
              'text-foreground/90 group-hover:text-foreground flex-1 truncate text-left text-sm font-medium',
              'group-hover:pr-[4.5rem]', // Apply padding only on hover for space for icons
            )}
            title={layout.title}
            onDoubleClick={() => setIsEditingTitle(true)}
          >
            {layout.title}
          </div>
        )}
        <div className="absolute top-1/2 right-0 flex -translate-y-1/2 items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          {!isEditingTitle && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground h-7 w-7"
                onClick={e => {
                  e.stopPropagation();
                  setIsEditingTitle(true);
                }}
                aria-label="Rename layout"
              >
                <Pencil className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive/80 hover:text-destructive h-7 w-7"
                onClick={e => {
                  e.stopPropagation();
                  handleDeleteLayout(layout.filename);
                }}
                aria-label="Delete layout"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Overlay Counter */}
      <div className="text-muted-foreground text-left text-xs">
        {layout.overlays.length} {layout.overlays.length === 1 ? 'overlay' : 'overlays'}
      </div>

      {/* Placeholder for Layout Preview */}
      <div className="bg-muted/30 text-muted-foreground flex w-full flex-1 items-center justify-center rounded-md text-xs">
        Layout Preview Area
      </div>
    </div>
  );
};
