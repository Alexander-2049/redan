import { AcceptedValueTypes } from '../settings-interface';

import { ColorSetting } from './color-setting';
import { ElementSetting as ElementSettingComponent } from './element-setting';
import { NumberSetting } from './number-setting';
import { SelectSetting } from './select-setting';
import { SliderSetting } from './slider-setting';
import { StringSetting } from './string-setting';
import { ToggleSetting } from './toggle-setting';

import {
  OverlayManifestElementType,
  OverlayManifestSettingType,
} from '@/main/shared/schemas/overlay-manifest-file-schema';
import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface SettingRendererProps {
  setting: OverlayManifestElementType | OverlayManifestSettingType;
  value: AcceptedValueTypes;
  onSettingChange: (id: string, value: AcceptedValueTypes) => void;
  isDragging?: boolean;
  dragHandleProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
  settingValues: Record<string, AcceptedValueTypes>;
  manifest: OverlayManifestFile;
}

// Type guard to check if setting is ElementSetting
function isElementSetting(
  setting: OverlayManifestSettingType | OverlayManifestElementType,
): setting is OverlayManifestElementType {
  return 'title' in setting && !('type' in setting);
}

export function SettingRenderer({
  setting,
  value,
  onSettingChange,
  isDragging = false,
  dragHandleProps,
  settingValues,
  manifest,
}: SettingRendererProps) {
  if (isElementSetting(setting)) {
    return (
      <ElementSettingComponent
        setting={setting}
        enabled={
          setting.visibility
            ? settingValues[setting.visibility.id] !== undefined
              ? !!settingValues[setting.visibility.id]
              : setting.visibility.defaultValue
            : undefined
        }
        onEnabledChange={enabled => {
          if (setting.visibility) {
            onSettingChange(setting.visibility.id, enabled);
          }
        }}
        onSettingChange={onSettingChange}
        settingValues={settingValues}
        isDragging={isDragging}
        dragHandleProps={dragHandleProps}
        manifest={manifest}
      />
    );
  }

  // Handle NonElementSetting types
  const nonElementSetting: OverlayManifestSettingType = setting;

  switch (nonElementSetting.type) {
    case 'slider':
      return (
        <SliderSetting
          setting={nonElementSetting}
          value={typeof value === 'number' ? value : nonElementSetting.defaultValue}
          onSettingChange={onSettingChange}
          manifest={manifest}
        />
      );
    case 'toggle':
      return (
        <ToggleSetting
          setting={nonElementSetting}
          value={typeof value === 'boolean' ? value : nonElementSetting.defaultValue}
          onSettingChange={onSettingChange}
          manifest={manifest}
        />
      );
    case 'select':
      return (
        <SelectSetting
          setting={nonElementSetting}
          value={typeof value === 'string' ? value : nonElementSetting.defaultValue}
          onSettingChange={onSettingChange}
          manifest={manifest}
        />
      );
    case 'number':
      return (
        <NumberSetting
          setting={nonElementSetting}
          value={typeof value === 'number' ? value : nonElementSetting.defaultValue}
          onSettingChange={onSettingChange}
          manifest={manifest}
        />
      );
    case 'string':
      return (
        <StringSetting
          setting={nonElementSetting}
          value={typeof value === 'string' ? value : nonElementSetting.defaultValue}
          onSettingChange={onSettingChange}
          manifest={manifest}
        />
      );
    case 'color':
      return (
        <ColorSetting
          setting={nonElementSetting}
          value={typeof value === 'string' ? value : nonElementSetting.defaultValue}
          onSettingChange={onSettingChange}
          manifest={manifest}
        />
      );
    default:
      return null;
  }
}
