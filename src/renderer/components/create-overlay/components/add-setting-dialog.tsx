import { useState } from 'react';

import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

import type { OverlayManifestSettingType } from '@/shared/types/OverlaySettingDescription';

interface AddSettingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (setting: OverlayManifestSettingType) => void;
}

export const AddSettingDialog = ({ isOpen, onClose, onAdd }: AddSettingDialogProps) => {
  const [settingType, setSettingType] = useState<string>('');
  const [settingId, setSettingId] = useState('');
  const [settingName, setSettingName] = useState('');

  const handleAdd = () => {
    if (!settingType || !settingId || !settingName) return;

    const baseSetting = {
      id: settingId,
      name: settingName,
      group: null,
      requiredFields: [],
    };

    let newSetting: OverlayManifestSettingType;

    switch (settingType) {
      case 'slider':
        newSetting = {
          ...baseSetting,
          type: 'slider' as const,
          min: 0,
          max: 100,
          step: 1,
          unit: null,
          defaultValue: 50,
        };
        break;
      case 'toggle':
        newSetting = {
          ...baseSetting,
          type: 'toggle' as const,
          defaultValue: false,
        };
        break;
      case 'select':
        newSetting = {
          ...baseSetting,
          type: 'select' as const,
          selectList: [],
          defaultValue: '',
        };
        break;
      case 'number':
        newSetting = {
          ...baseSetting,
          type: 'number' as const,
          defaultValue: 0,
        };
        break;
      case 'string':
        newSetting = {
          ...baseSetting,
          type: 'string' as const,
          defaultValue: '',
        };
        break;
      case 'color':
        newSetting = {
          ...baseSetting,
          type: 'color' as const,
          defaultValue: '#000000',
        };
        break;
      default:
        return;
    }

    onAdd(newSetting);
    handleClose();
  };

  const handleClose = () => {
    setSettingType('');
    setSettingId('');
    setSettingName('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Setting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="settingType">Setting Type</Label>
            <Select value={settingType} onValueChange={setSettingType}>
              <SelectTrigger>
                <SelectValue placeholder="Select setting type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="slider">Slider</SelectItem>
                <SelectItem value="toggle">Toggle</SelectItem>
                <SelectItem value="select">Select</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="string">String</SelectItem>
                <SelectItem value="color">Color</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="settingId">Setting ID</Label>
            <Input
              id="settingId"
              value={settingId}
              onChange={e => setSettingId(e.target.value)}
              placeholder="unique_setting_id"
            />
          </div>
          <div>
            <Label htmlFor="settingName">Display Name</Label>
            <Input
              id="settingName"
              value={settingName}
              onChange={e => setSettingName(e.target.value)}
              placeholder="Setting Name"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!settingType || !settingId || !settingName}>
            Add Setting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
