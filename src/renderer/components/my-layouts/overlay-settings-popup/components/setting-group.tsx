import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableStateSnapshot,
  DraggableProvidedDraggableProps,
} from '@hello-pangea/dnd';
import { GripVertical, RotateCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

import { AcceptedValueTypes } from '../settings-interface';

import { SettingRenderer } from './setting-renderer';

import {
  OverlayManifestDefaultGroup,
  OverlayManifestReorderableGroup,
} from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface SettingsGroupProps {
  group: OverlayManifestDefaultGroup | OverlayManifestReorderableGroup;
  settingValues: Record<string, any>;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
}

const getStyle = (
  style: DraggableProvidedDraggableProps['style'],
  snapshot: DraggableStateSnapshot,
): CSSProperties => {
  if (!snapshot.isDropAnimating) {
    return style || {};
  }
  return {
    ...style,
    transitionDuration: '0.1s', // basically removes the animation
  };
};

export function SettingsGroup({
  group,
  settingValues,
  onSettingChange,
  manifest,
}: SettingsGroupProps) {
  const [ids, setIds] = useState<string[]>(
    group.type === 'default'
      ? group.settings.map(e => e.id)
      : settingValues[group.id]
        ? settingValues[group.id]
        : group.elements.map(e => e.id),
  );

  useEffect(() => {
    setIds(
      group.type === 'default'
        ? group.settings.map(e => e.id)
        : settingValues[group.id]
          ? settingValues[group.id]
          : group.elements.map(e => e.id),
    );
  }, [settingValues]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const newOrder = Array.from(ids);
    const [moved] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, moved);

    setIds(newOrder);
    onSettingChange(group.id, newOrder);
  };

  const getDefaultOrder = () => {
    return group.type === 'reorderable' ? group.elements.map(e => e.id) : [];
  };

  const isOrderDefault = () => {
    if (group.type !== 'reorderable') return true;
    const defaultOrder = getDefaultOrder();
    return JSON.stringify(ids) === JSON.stringify(defaultOrder);
  };

  const handleResetOrder = () => {
    const defaultOrder = getDefaultOrder();
    setIds(defaultOrder);
    onSettingChange(group.id, defaultOrder);
  };

  if (group.type === 'default') {
    // Default group - render normally
    return (
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
            </div>
          </div>
        </div>
        <div className="space-y-6 p-6">
          {ids.map(id => {
            const setting = group.settings.find(e => e.id === id);
            if (!setting) return null;
            return (
              <div key={id}>
                <SettingRenderer
                  setting={setting}
                  value={settingValues[id]}
                  onSettingChange={onSettingChange}
                  settingValues={settingValues}
                  manifest={manifest}
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Reorderable group - render with drag and drop
  return (
    <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-500">
              Drag to reorder
            </span>
          </div>

          {!isOrderDefault() && (
            <button
              onClick={handleResetOrder}
              className="flex items-center space-x-1 rounded-lg border border-orange-200 bg-orange-50 px-3 py-1 text-xs text-orange-700 transition-colors hover:bg-orange-100"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset items order</span>
            </button>
          )}
        </div>
      </div>
      <div className="p-6">
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="settings-list">
            {provided => (
              <div className="space-y-4" ref={provided.innerRef} {...provided.droppableProps}>
                {ids.map((id, index) => {
                  const setting = group.elements.find(e => e.id === id);
                  if (!setting) return null;

                  return (
                    <Draggable key={id} draggableId={id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          style={getStyle(provided.draggableProps.style, snapshot)} // 👈 apply override
                          className={snapshot.isDragging ? 'z-50' : ''}
                        >
                          <SettingRenderer
                            setting={setting as unknown as SettingType}
                            value={settingValues[id]}
                            onSettingChange={onSettingChange}
                            isDragging={snapshot.isDragging}
                            settingValues={settingValues}
                            manifest={manifest}
                            dragHandleProps={{
                              ...provided.dragHandleProps,
                              style: {
                                cursor: snapshot.isDragging ? 'grabbing' : 'grab',
                              },
                            }}
                          />
                        </div>
                      )}
                    </Draggable>
                  );
                })}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
}
