import { ChevronDown, HelpCircle } from 'lucide-react';

import { AcceptedValueTypes } from '../settings-interface';

import ResetToDefaultButton from './reset-to-default-button';

import { OverlayManifestSelectSettingType } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

// import { SelectSettingType } from '../../schemas/settings';
// import type { OverlayManifest } from '../../types/settings';
// import { AcceptedValueTypes } from '../SettingsInterface';

// import ResetToDefaultButton from './ResetToDefaultButton';

interface SelectSettingProps {
  setting: OverlayManifestSelectSettingType;
  value: string;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
}

export function SelectSetting({ setting, value, onSettingChange }: SelectSettingProps) {
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
      <div className="relative">
        <select
          value={value}
          onChange={e => onSettingChange(setting.id, e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        >
          {setting.selectList.map(option => (
            <option key={option.id} value={option.id}>
              {option.value}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-2.5 right-3 h-4 w-4 text-gray-400" />
      </div>
    </div>
  );
}
