import type { OverlaySettingDescription } from '@/shared/types/OverlaySettingDescription';
import type { SettingsMap } from '@/shared/types/SettingValue';

export const createDefaultSettings = (settings: OverlaySettingDescription[]): SettingsMap => {
  const defaultSettings: SettingsMap = {};

  settings.forEach(setting => {
    defaultSettings[setting.id] = setting.defaultValue;
  });

  return defaultSettings;
};

export const groupSettingsByGroup = (settings: OverlaySettingDescription[]) => {
  const grouped: Record<string, OverlaySettingDescription[]> = {};

  settings.forEach(setting => {
    const groupName = setting.group || 'ungrouped';
    if (!grouped[groupName]) {
      grouped[groupName] = [];
    }
    grouped[groupName].push(setting);
  });

  return grouped;
};
