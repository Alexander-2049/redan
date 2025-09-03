import { HelpCircle } from 'lucide-react';
import React from 'react';

import { AcceptedValueTypes } from '../settings-interface';

import ResetToDefaultButton from './reset-to-default-button';

import { OverlayManifestColorSettingType } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface ColorSettingProps {
  setting: OverlayManifestColorSettingType;
  value: string;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
}

export function ColorSetting({ setting, value, onSettingChange }: ColorSettingProps) {
  const handleTextBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    onSettingChange(setting.id, e.target.value);
  };

  const isDefault = value === setting.defaultValue;

  const handleReset = () => {
    onSettingChange(setting.id, setting.defaultValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          {setting.name}
          {setting.description && (
            <span className="group relative ml-1 inline-block">
              <HelpCircle className="h-3 w-3 cursor-help text-gray-400" />
              <div className="invisible absolute bottom-full left-1/2 z-10 mb-2 -translate-x-1/2 transform rounded-lg bg-gray-900 px-3 py-2 text-xs whitespace-nowrap text-white opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                {setting.description}
                <div className="absolute top-full left-1/2 h-0 w-0 -translate-x-1/2 transform border-t-4 border-r-4 border-l-4 border-transparent border-t-gray-900"></div>
              </div>
            </span>
          )}
        </label>

        {!isDefault && <ResetToDefaultButton handleReset={handleReset} />}
      </div>
      <div className="flex items-center space-x-3">
        <input
          type="color"
          value={value}
          onChange={e => onSettingChange(setting.id, e.target.value)}
          className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <input
          type="text"
          value={value}
          onChange={() => {}} // Only update on blur
          onBlur={handleTextBlur}
          className="flex-1 rounded-lg border border-gray-300 px-3 py-2 font-mono text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="#000000"
        />
      </div>
    </div>
  );
}
