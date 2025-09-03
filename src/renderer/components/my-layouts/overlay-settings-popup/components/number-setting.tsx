import { HelpCircle } from 'lucide-react';
import React from 'react';

import { AcceptedValueTypes } from '../settings-interface';

import ResetToDefaultButton from './reset-to-default-button';

import { OverlayManifestNumberSettingType } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
interface NumberSettingProps {
  setting: OverlayManifestNumberSettingType;
  value: number;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
}

export function NumberSetting({ setting, value, onSettingChange }: NumberSettingProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      // Allow empty input temporarily
      return;
    }
    const numValue = Number(inputValue);
    if (!isNaN(numValue)) {
      onSettingChange(setting.id, numValue);
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (inputValue === '' || isNaN(Number(inputValue))) {
      onSettingChange(setting.id, setting.defaultValue);
    }
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
      <input
        type="number"
        min={setting.min}
        max={setting.max}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
    </div>
  );
}
