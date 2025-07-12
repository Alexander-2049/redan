import { useState, useCallback } from 'react';
import type React from 'react';
import type { ReactElement } from 'react';

import { LayoutItem } from './layout-item';

import type { LayoutFile } from '@/shared/types/LayoutFile';

interface ExtendedLayoutFile extends LayoutFile {
  filename: string;
}

interface LayoutListProps {
  layouts: ExtendedLayoutFile[];
  activeLayoutFilename?: string;
  handleDeleteLayout: (filename: string) => void;
  handleRenameLayout: (filename: string, newTitle: string) => void;
  handleReorderLayouts: (filenames: string[]) => void;
}

export const LayoutList = ({
  layouts,
  activeLayoutFilename,
  handleDeleteLayout,
  handleRenameLayout,
  handleReorderLayouts,
}: LayoutListProps): ReactElement => {
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);

  const handleDragStart = useCallback((e: React.DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItemIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', index.toString()); // Required for Firefox
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Necessary to allow drop
    e.dataTransfer.dropEffect = 'move';
    // No visual placeholder needed for direct swap, just allow drop
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>, dropIndex: number) => {
      e.preventDefault();
      if (draggedItemIndex === null || draggedItemIndex === dropIndex) {
        setDraggedItemIndex(null);
        return;
      }

      const newLayouts = [...layouts];
      // Perform a direct swap
      [newLayouts[draggedItemIndex], newLayouts[dropIndex]] = [
        newLayouts[dropIndex],
        newLayouts[draggedItemIndex],
      ];

      handleReorderLayouts(newLayouts.map(l => l.filename)); // Notify parent
      setDraggedItemIndex(null);
    },
    [draggedItemIndex, layouts, handleReorderLayouts],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedItemIndex(null);
  }, []);

  return (
    <>
      {layouts.map((layout, index) => (
        <LayoutItem
          key={layout.filename} // Use filename as key for stable identity
          layout={layout}
          index={index} // Pass index for drag operations
          isActive={activeLayoutFilename === layout.filename} // Pass active state
          draggedItemIndex={draggedItemIndex}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver} // Simplified for direct swap
          onDrop={handleDrop} // Simplified for direct swap
          onDragEnd={handleDragEnd}
          handleDeleteLayout={handleDeleteLayout}
          handleRenameLayout={handleRenameLayout}
        />
      ))}
    </>
  );
};
