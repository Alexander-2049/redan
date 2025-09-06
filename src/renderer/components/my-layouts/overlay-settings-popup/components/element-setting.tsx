import { ChevronDown, ChevronUp, Eye, EyeOff, GripVertical } from 'lucide-react';
import { useState } from 'react';

import { AcceptedValueTypes } from '../settings-interface';

import { SettingRenderer } from './setting-renderer';

import { OverlayManifestElementType } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface ElementSettingProps {
  setting: OverlayManifestElementType;
  enabled?: boolean;
  onEnabledChange: (enabled: boolean) => void;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  settingValues: Record<string, AcceptedValueTypes>;
  isDragging?: boolean;
  dragHandleProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  manifest: OverlayManifestFile;
}

export function ElementSetting({
  setting,
  enabled,
  onEnabledChange,
  onSettingChange,
  settingValues,
  isDragging = false,
  dragHandleProps,
  manifest,
}: ElementSettingProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't expand if clicking on buttons or interactive elements
    const target = e.target as HTMLElement;
    if (target.closest('button')) {
      return;
    }

    if (setting.settings && setting.settings.length > 0) {
      setIsExpanded(!isExpanded);
    }
  };

  return (
    <div
      className={`rounded-lg border border-gray-200 bg-white transition-all duration-200 ${
        isDragging
          ? 'ring-opacity-50 shadow-lg ring-2 ring-blue-500'
          : 'shadow-sm hover:border-gray-300 hover:shadow-md'
      }`}
    >
      <div
        {...dragHandleProps}
        className="cursor-pointer p-4 transition-colors hover:bg-gray-50"
        onClick={handleCardClick}
        style={dragHandleProps?.style}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <GripVertical className="h-5 w-5 text-gray-400" />
            <div className="flex items-center space-x-2">
              <button
                onClick={e => {
                  e.stopPropagation();
                  onEnabledChange(!enabled);
                }}
                className={`rounded-md p-1 transition-colors ${
                  enabled ? 'text-green-600 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'
                }`}
              >
                {enabled !== undefined ? (
                  enabled ? (
                    <Eye className="h-4 w-4" />
                  ) : (
                    <EyeOff className="h-4 w-4" />
                  )
                ) : (
                  ''
                )}
              </button>
              <span className={`font-medium ${enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                {setting.title}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {setting.settings && setting.settings.length > 0 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setIsExpanded(!isExpanded);
                }}
                className="p-1 text-gray-400 transition-colors hover:text-gray-600"
              >
                {isExpanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {isExpanded && setting.settings && setting.settings.length > 0 && (
        <div className="mt-0 space-y-4 border-t border-gray-100 bg-gray-50 px-4 pt-4 pb-4">
          {setting.settings.map(subSetting => (
            <div key={subSetting.id} className="ml-6">
              <SettingRenderer
                setting={subSetting}
                value={settingValues[subSetting.id] ?? subSetting.defaultValue}
                onSettingChange={onSettingChange}
                settingValues={settingValues}
                manifest={manifest}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
