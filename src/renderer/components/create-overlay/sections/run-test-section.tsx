import { useState } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { BaseUrlConfig } from '../components/base-url-config';
import { OverlayControls } from '../components/overlay-controls';
import { OverlaySettings } from '../components/overlay-settings';
import { useOverlaySettings } from '../hooks/use-overlay-settings';
import { useOverlayWindow } from '../hooks/use-overlay-window';

import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import type { SettingValue } from '@/shared/types/SettingValue';

interface RunTestSectionProps {
  manifest: OverlayManifestFile;
}

export const RunTestSection = ({ manifest }: RunTestSectionProps) => {
  const [editMode, setEditMode] = useState(false);
  const [baseUrl, setBaseUrl] = useState('http://localhost:3000');

  const {
    isOverlayOpen,
    overlayWindow,
    openOverlay,
    closeOverlay,
    isLoading: windowLoading,
  } = useOverlayWindow(manifest, baseUrl);

  const { settings, updateSetting, resetSetting, resetAllSettings, sendSettingsToOverlay } =
    useOverlaySettings(manifest, overlayWindow);

  const handleToggleEditMode = () => {
    const newEditMode = !editMode;
    setEditMode(newEditMode);

    // Send edit mode to overlay via Electron API or postMessage
    if (window.overlay?.updateEditMode) {
      void window.overlay.updateEditMode(newEditMode);
    } else if (overlayWindow && !overlayWindow.closed) {
      overlayWindow.postMessage(
        {
          type: 'EDIT_MODE_TOGGLE',
          editMode: newEditMode,
        },
        '*',
      );
    }
  };

  const handleSettingChange = (settingId: string, value: SettingValue) => {
    updateSetting(settingId, value);

    // Send settings update via Electron API or postMessage
    if (window.overlay?.updateSettings) {
      const settingsArray = Object.entries(settings).map(([key, val]) => ({ [key]: val }));
      void window.overlay.updateSettings(settingsArray);
    } else {
      sendSettingsToOverlay();
    }
  };

  const handleResetSetting = (settingId: string) => {
    resetSetting(settingId);

    // Send settings update after reset
    if (window.overlay?.updateSettings) {
      const settingsArray = Object.entries(settings).map(([key, val]) => ({ [key]: val }));
      void window.overlay.updateSettings(settingsArray);
    } else {
      sendSettingsToOverlay();
    }
  };

  const handleResetAllSettings = () => {
    resetAllSettings();

    // Send settings update after reset all
    if (window.overlay?.updateSettings) {
      const settingsArray = Object.entries(settings).map(([key, val]) => ({ [key]: val }));
      void window.overlay.updateSettings(settingsArray);
    } else {
      sendSettingsToOverlay();
    }
  };

  const handleOpenOverlay = () => {
    openOverlay();
  };

  const handleBaseUrlChange = (newBaseUrl: string) => {
    setBaseUrl(newBaseUrl);
  };

  return (
    <div className="space-y-6">
      {/* Base URL Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>Overlay Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <BaseUrlConfig baseUrl={baseUrl} onBaseUrlChange={handleBaseUrlChange} />
        </CardContent>
      </Card>

      {/* Overlay Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Overlay Controls</CardTitle>
        </CardHeader>
        <CardContent>
          <OverlayControls
            isOverlayOpen={isOverlayOpen}
            editMode={editMode}
            isLoading={windowLoading}
            onOpenOverlay={handleOpenOverlay}
            onCloseOverlay={closeOverlay}
            onToggleEditMode={handleToggleEditMode}
          />
        </CardContent>
      </Card>

      {/* Overlay Settings - Always visible for testing */}
      <Card>
        <CardHeader>
          <CardTitle>Live Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <OverlaySettings
            settings={settings}
            manifest={manifest}
            onSettingChange={handleSettingChange}
            onResetSetting={handleResetSetting}
            onResetAllSettings={handleResetAllSettings}
            isOverlayOpen={isOverlayOpen}
          />
        </CardContent>
      </Card>
    </div>
  );
};
