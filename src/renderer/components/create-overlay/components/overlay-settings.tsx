import { RotateCcw, RefreshCw, AlertCircle } from 'lucide-react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Separator } from '../../ui/separator';
import { groupSettingsByGroup } from '../utils/settings-utils';

import { SettingControl } from './setting-control';

import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import type { SettingsMap, SettingValue } from '@/shared/types/SettingValue';

interface OverlaySettingsProps {
  settings: SettingsMap;
  manifest: OverlayManifestFile;
  onSettingChange: (settingId: string, value: SettingValue) => void;
  onResetSetting: (settingId: string) => void;
  onResetAllSettings: () => void;
  isOverlayOpen: boolean;
}

export const OverlaySettings = ({
  settings,
  manifest,
  onSettingChange,
  onResetSetting,
  onResetAllSettings,
  isOverlayOpen,
}: OverlaySettingsProps) => {
  const groupedSettings = groupSettingsByGroup(manifest.settings);

  if (manifest.settings.length === 0) {
    return (
      <div className="text-muted-foreground py-8 text-center">
        <p>No settings configured.</p>
        <p className="text-sm">Add settings in the Configure tab to test them here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Status Alert */}
      {!isOverlayOpen && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Settings can be adjusted even when the overlay is closed. Changes will be applied when
            the overlay opens.
          </AlertDescription>
        </Alert>
      )}

      {/* Reset All Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Test Settings</h3>
        <Button onClick={onResetAllSettings} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset All Settings
        </Button>
      </div>

      {/* Grouped Settings */}
      {Object.entries(groupedSettings).map(([groupName, groupSettings]) => (
        <Card key={groupName} className="border-muted">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {groupName === 'ungrouped' ? 'General Settings' : groupName}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {groupSettings.map((setting, index) => (
              <div key={setting.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <SettingControl
                      setting={setting}
                      value={settings[setting.id] ?? setting.defaultValue}
                      onChange={value => onSettingChange(setting.id, value)}
                    />
                  </div>
                  <Button
                    onClick={() => onResetSetting(setting.id)}
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    title="Reset to default value"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </div>
                {index < groupSettings.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
