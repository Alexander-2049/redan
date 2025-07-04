import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import type { SettingsMap } from '@/shared/types/SettingValue';

export const generateOverlayUrl = (manifest: OverlayManifestFile, baseUrl: string): string => {
  // Create URL with preview parameter
  const url = new URL(baseUrl);
  url.searchParams.set('preview', 'true');

  // Add all settings as query parameters
  manifest.settings.forEach(setting => {
    url.searchParams.set(setting.id, String(setting.defaultValue));
  });

  // Add required and optional fields
  if (manifest.requiredFields.length > 0) {
    url.searchParams.set('requiredFields', manifest.requiredFields.join(','));
  }

  if (manifest.optionalFields.length > 0) {
    url.searchParams.set('optionalFields', manifest.optionalFields.join(','));
  }

  // Add manifest metadata
  url.searchParams.set('title', manifest.title);
  url.searchParams.set('width', String(manifest.dimentions.defaultWidth));
  url.searchParams.set('height', String(manifest.dimentions.defaultHeight));

  return url.toString();
};

export const updateOverlayUrl = (baseUrl: string, settings: SettingsMap): string => {
  const url = new URL(baseUrl);

  // Update settings parameters
  Object.entries(settings).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
};
