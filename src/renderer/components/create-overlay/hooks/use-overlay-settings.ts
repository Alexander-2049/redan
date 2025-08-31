import { useState, useCallback, useEffect } from 'react';

// import { createDefaultSettings } from '../utils/settings-utils';

import { createDefaultSettings } from '../utils/settings-utils';

import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import type { SettingsMap, SettingValue } from '@/shared/types/SettingValue';

export const useOverlaySettings = (manifest: OverlayManifestFile, overlayWindow: Window | null) => {
  const [settings, setSettings] = useState<SettingsMap>(() => createDefaultSettings(manifest));

  // Reset settings when manifest changes
  useEffect(() => {
    const newSettings = createDefaultSettings(manifest);
    setSettings(newSettings);
  }, [manifest.pages]);

  const updateSetting = useCallback((settingId: string, value: SettingValue) => {
    setSettings(prev => ({
      ...prev,
      [settingId]: value,
    }));
  }, []);

  const resetSetting = useCallback(() => {
    setSettings(createDefaultSettings(manifest));
  }, [manifest]);

  const resetAllSettings = useCallback(() => {
    const newSettings = createDefaultSettings(manifest);
    setSettings(newSettings);
  }, [manifest]);

  const loadSettings = useCallback((savedSettings: SettingsMap) => {
    setSettings(savedSettings);
  }, []);

  const sendSettingsToOverlay = useCallback(() => {
    if (overlayWindow && !overlayWindow.closed) {
      try {
        overlayWindow.postMessage(
          {
            type: 'SETTINGS_UPDATE',
            settings: settings,
          },
          '*',
        );
      } catch (error) {
        // Silent error handling for closed windows
        // console.debug('Failed to send settings to overlay:', error);
      }
    }
  }, [overlayWindow, settings]);

  return {
    settings,
    updateSetting,
    resetSetting,
    resetAllSettings,
    loadSettings,
    sendSettingsToOverlay,
  };
};
