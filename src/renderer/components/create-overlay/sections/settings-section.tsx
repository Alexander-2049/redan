import { Plus, HelpCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';
import { AddSettingDialog } from '../components/add-setting-dialog';
import { SettingItem } from '../components/setting-item';

import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import type { OverlaySettingDescription } from '@/shared/types/OverlaySettingDescription';

interface SettingsSectionProps {
  manifest: OverlayManifestFile;
  onUpdate: (updates: Partial<OverlayManifestFile>) => void;
}

export const SettingsSection = ({ manifest, onUpdate }: SettingsSectionProps) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const addSetting = (setting: OverlaySettingDescription) => {
    onUpdate({ settings: [...manifest.settings, setting] });
  };

  const updateSetting = (index: number, updatedSetting: OverlaySettingDescription) => {
    const newSettings = [...manifest.settings];
    newSettings[index] = updatedSetting;
    onUpdate({ settings: newSettings });
  };

  const removeSetting = (index: number) => {
    const newSettings = manifest.settings.filter((_, i) => i !== index);
    onUpdate({ settings: newSettings });
  };

  const duplicateSetting = (index: number) => {
    const settingToDuplicate = manifest.settings[index];
    const duplicatedSetting = {
      ...settingToDuplicate,
      id: `${settingToDuplicate.id}_copy_${Date.now()}`,
      name: `${settingToDuplicate.name} (Copy)`,
    };
    onUpdate({ settings: [...manifest.settings, duplicatedSetting] });
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            Settings
            <Tooltip>
              <TooltipTrigger>
                <HelpCircle className="text-muted-foreground h-4 w-4" />
              </TooltipTrigger>
              <TooltipContent>
                <p>Configure overlay settings that users can customize</p>
              </TooltipContent>
            </Tooltip>
          </CardTitle>
          <Button onClick={() => setIsAddDialogOpen(true)} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Setting
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {manifest.settings.length === 0 ? (
          <div className="text-muted-foreground py-8 text-center">
            <p>No settings configured yet.</p>
            <p className="text-sm">Click "Add Setting" to create your first overlay setting.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {manifest.settings.map((setting, index) => (
              <SettingItem
                key={setting.id}
                setting={setting}
                onUpdate={updatedSetting => updateSetting(index, updatedSetting)}
                onRemove={() => removeSetting(index)}
                onDuplicate={() => duplicateSetting(index)}
              />
            ))}
          </div>
        )}

        <AddSettingDialog
          isOpen={isAddDialogOpen}
          onClose={() => setIsAddDialogOpen(false)}
          onAdd={addSetting}
        />
      </CardContent>
    </Card>
  );
};
