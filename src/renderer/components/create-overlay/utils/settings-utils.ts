import { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import type { SettingsMap } from '@/shared/types/SettingValue';

export const createDefaultSettings = (manifest: OverlayManifestFile): SettingsMap => {
  const defaultSettings: SettingsMap = {};

  manifest.pages.forEach(page => {
    page.groups.forEach(group => {
      if (group.type === 'default') {
        group.settings.forEach(setting => {
          defaultSettings[setting.id] = setting.defaultValue;
        });
      }
      if (group.type === 'reorderable') {
        group.elements.forEach(element => {
          (element.settings || []).forEach(setting => {
            defaultSettings[setting.id] = setting.defaultValue;
          });
        });
      }
    });
  });

  return defaultSettings;
};

// export const groupSettingsByGroup = (pages: OverlayManifestSettingType[]) => {
//   const grouped: Record<string, OverlayManifestSettingType[]> = {};

//   pages.forEach(setting => {
//     const groupName = setting.group || 'ungrouped';
//     if (!grouped[groupName]) {
//       grouped[groupName] = [];
//     }
//     grouped[groupName].push(setting);
//   });

//   return grouped;
// };
