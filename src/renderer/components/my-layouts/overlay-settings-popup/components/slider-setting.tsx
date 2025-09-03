import { HelpCircle } from 'lucide-react';

import { AcceptedValueTypes } from '../settings-interface';

import ResetToDefaultButton from './reset-to-default-button';

import { OverlayManifestSliderSettingType } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

// import { SliderSettingType } from '../../schemas/settings';
// import type { OverlayManifest } from '../../types/settings';
// import { AcceptedValueTypes } from '../SettingsInterface';

// import ResetToDefaultButton from './ResetToDefaultButton';

interface SliderSettingProps {
  setting: OverlayManifestSliderSettingType;
  value: number;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  manifest: OverlayManifestFile;
}

export function SliderSetting({ setting, value, onSettingChange }: SliderSettingProps) {
  const percentage = ((value - setting.min) / (setting.max - setting.min)) * 100;

  const formatValue = (val: number) => {
    if (setting.unit === 'percentage') {
      return `${val}%`;
    }
    return val.toString();
  };

  const isDefault = value === setting.defaultValue;

  const handleReset = () => {
    onSettingChange(setting.id, setting.defaultValue);
  };

  return (
    <div className="space-y-3">
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
          <span className="min-w-[3rem] text-right text-sm font-semibold text-blue-600">
            {formatValue(value)}
          </span>
        </div>
      </div>
      <div className="relative">
        <input
          type="range"
          min={setting.min}
          max={setting.max}
          step={setting.step}
          value={value}
          onChange={e => onSettingChange(setting.id, Number(e.target.value))}
          className="slider h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        <style>{`
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            transition: all 0.15s ease-in-out;
          }
          .slider::-webkit-slider-thumb:hover {
            background: #2563eb;
            transform: scale(1.1);
          }
          .slider::-moz-range-thumb {
            height: 20px;
            width: 20px;
            border-radius: 50%;
            background: #3b82f6;
            cursor: pointer;
            border: 2px solid #ffffff;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            transition: all 0.15s ease-in-out;
          }
        `}</style>
      </div>
    </div>
  );
}
