import {
  DndContext,
  type DragEndEvent,
  type DragStartEvent,
  closestCenter,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  type AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import type { AcceptedValueTypes } from '../settings-interface';

import { SettingRenderer } from './setting-renderer';

import type {
  OverlayManifestDefaultGroup,
  OverlayManifestReorderableGroup,
} from '@/main/shared/schemas/overlay-manifest-file-schema';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

type SettingsGroupProps = {
  group: OverlayManifestDefaultGroup | OverlayManifestReorderableGroup;
  settingValues: Record<string, AcceptedValueTypes>;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
};

type SortableSettingItemProps = {
  id: string;
  group: OverlayManifestReorderableGroup;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
  settingValues: Record<string, AcceptedValueTypes>;
  isDraggingOverlay?: boolean;
};

const animateLayoutChanges: AnimateLayoutChanges = args => defaultAnimateLayoutChanges(args);

function SortableSettingItem({
  id,
  group,
  onSettingChange,
  manifest,
  settingValues,
  isDraggingOverlay = false,
}: SortableSettingItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id,
    animateLayoutChanges,
  });

  const style: React.CSSProperties = isDraggingOverlay
    ? {
        zIndex: 9999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
        transform: CSS.Transform.toString({
          x: (transform?.x || 0) - 81, // magic numbers to fix wrong offset
          y: (transform?.y || 0) - 36, // magic numbers to fix wrong offset
          scaleX: 1,
          scaleY: 1,
        }),
      }
    : {
        transform: CSS.Transform.toString({
          x: transform?.x || 0,
          y: transform?.y || 0,
          scaleX: 1, // prevent scaling
          scaleY: 1, // prevent scaling
        }),
        transition: transition ? transition.replace(/(\d+)ms/, '0ms') : 'transform 0ms ease',
        opacity: isDragging ? 0.4 : 1,
      };

  const setting = useMemo(() => group.elements.find(e => e.id === id), [group.elements, id]);
  if (!setting) return null;

  return (
    <div ref={setNodeRef} style={style}>
      <SettingRenderer
        setting={setting}
        onSettingChange={onSettingChange}
        isDragging={isDragging}
        settingValues={settingValues}
        manifest={manifest}
        dragHandleProps={
          !isDraggingOverlay
            ? {
                ...attributes,
                ...listeners,
                style: {
                  cursor: isDragging ? 'grabbing' : 'grab',
                },
              }
            : undefined
        }
      />
    </div>
  );
}

export function SettingsGroup({
  group,
  settingValues,
  onSettingChange,
  manifest,
}: SettingsGroupProps) {
  const initialIds: string[] =
    group.type === 'default'
      ? group.settings.map(e => e.id)
      : ((settingValues[group.id] as string[] | undefined) ?? group.elements.map(e => e.id));

  const [ids, setIds] = useState<string[]>(initialIds);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setIds(
      group.type === 'default'
        ? group.settings.map(e => e.id)
        : ((settingValues[group.id] as string[] | undefined) ?? group.elements.map(e => e.id)),
    );
  }, [group, settingValues]);

  const getDefaultOrder = useCallback((): string[] => {
    return group.type === 'reorderable' ? group.elements.map(e => e.id) : [];
  }, [group]);

  const isOrderDefault = useMemo((): boolean => {
    if (group.type !== 'reorderable') return true;
    const defaultOrder = getDefaultOrder();
    return ids.length === defaultOrder.length && ids.every((v, i) => v === defaultOrder[i]);
  }, [getDefaultOrder, group.type, ids]);

  const handleResetOrder = useCallback((): void => {
    const defaultOrder = getDefaultOrder();
    setIds(defaultOrder);
    onSettingChange(group.id, defaultOrder);
  }, [getDefaultOrder, group.id, onSettingChange]);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 0 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 0, tolerance: 2 } }),
    useSensor(KeyboardSensor),
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  }, []);

  const handleDragEnd = useCallback(
    (event: DragEndEvent): void => {
      setActiveId(null);

      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const oldIndex = ids.indexOf(String(active.id));
      const newIndex = ids.indexOf(String(over.id));
      if (oldIndex === -1 || newIndex === -1) return;

      const newOrder = arrayMove(ids, oldIndex, newIndex);
      setIds(newOrder);
      onSettingChange(group.id, newOrder);
    },
    [group.id, ids, onSettingChange],
  );

  if (group.type === 'default') {
    return (
      <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
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

  return (
    <div className="mb-4 rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <GripVertical className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">{group.title}</h3>
            <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-500">
              Drag to reorder
            </span>
          </div>

          {!isOrderDefault && (
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
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={ids} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {ids.map(id => (
                <SortableSettingItem
                  key={id}
                  id={id}
                  group={group}
                  onSettingChange={onSettingChange}
                  manifest={manifest}
                  settingValues={settingValues}
                />
              ))}
            </div>
          </SortableContext>

          <DragOverlay
            dropAnimation={{
              duration: 100,
            }}
          >
            {activeId ? (
              <SortableSettingItem
                id={activeId}
                group={group}
                onSettingChange={onSettingChange}
                manifest={manifest}
                settingValues={settingValues}
                isDraggingOverlay
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
