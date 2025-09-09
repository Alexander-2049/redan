import { HelpCircle } from 'lucide-react';

import { AcceptedValueTypes } from '../settings-interface';

import ResetToDefaultButton from './reset-to-default-button';

import { OverlayManifestToggleSettingType } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface ToggleSettingProps {
  setting: OverlayManifestToggleSettingType;
  value: boolean;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
}

export function ToggleSetting({ setting, value, onSettingChange }: ToggleSettingProps) {
  const isDefault = value === setting.defaultValue;

  const handleReset = () => {
    onSettingChange(setting.id, setting.defaultValue);
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
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
      </div>

      <div className="flex items-center space-x-3">
        {!isDefault && <ResetToDefaultButton handleReset={handleReset} />}
        <button
          type="button"
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors hover:cursor-pointer focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none ${
            value ? 'bg-blue-600' : 'bg-gray-200'
          }`}
          onClick={() => onSettingChange(setting.id, !value)}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              value ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );
}
