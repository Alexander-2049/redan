import { HelpCircle, Plus, X } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

import type { OverlaySettingDescription } from '@/shared/types/OverlaySettingDescription';

interface SettingFormProps {
  setting: OverlaySettingDescription;
  onUpdate: (setting: OverlaySettingDescription) => void;
}

export const SettingForm = ({ setting, onUpdate }: SettingFormProps) => {
  const [newRequiredField, setNewRequiredField] = useState('');
  const [newSelectOption, setNewSelectOption] = useState({ id: '', value: '' });

  const updateSetting = (updates: Partial<OverlaySettingDescription>) => {
    onUpdate({ ...setting, ...updates } as OverlaySettingDescription);
  };

  const addRequiredField = () => {
    if (newRequiredField && !setting.requiredFields.includes(newRequiredField)) {
      updateSetting({ requiredFields: [...setting.requiredFields, newRequiredField] });
      setNewRequiredField('');
    }
  };

  const removeRequiredField = (fieldToRemove: string) => {
    updateSetting({
      requiredFields: setting.requiredFields.filter(field => field !== fieldToRemove),
    });
  };

  const addSelectOption = () => {
    if (setting.type === 'select' && newSelectOption.id && newSelectOption.value) {
      const existingIds = setting.selectList.map(item => item.id);
      if (!existingIds.includes(newSelectOption.id)) {
        updateSetting({
          selectList: [...setting.selectList, newSelectOption],
        });
        setNewSelectOption({ id: '', value: '' });
      }
    }
  };

  const removeSelectOption = (idToRemove: string) => {
    if (setting.type === 'select') {
      updateSetting({
        selectList: setting.selectList.filter(item => item.id !== idToRemove),
      });
    }
  };

  const renderTypeSpecificFields = () => {
    switch (setting.type) {
      case 'slider':
        return (
          <>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="min">Min Value</Label>
                <Input
                  id="min"
                  type="number"
                  value={setting.min}
                  onChange={e => updateSetting({ min: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="max">Max Value</Label>
                <Input
                  id="max"
                  type="number"
                  value={setting.max}
                  onChange={e => updateSetting({ max: Number(e.target.value) })}
                />
              </div>
              <div>
                <Label htmlFor="step">Step</Label>
                <Input
                  id="step"
                  type="number"
                  step="0.01"
                  value={setting.step}
                  onChange={e => updateSetting({ step: Number(e.target.value) })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={setting.unit || 'none'}
                onValueChange={value =>
                  updateSetting({
                    unit: value === 'none' ? null : (value as 'number' | 'percentage'),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit (optional)" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="percentage">Percentage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                type="number"
                value={setting.defaultValue}
                onChange={e => updateSetting({ defaultValue: Number(e.target.value) })}
              />
            </div>
          </>
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id="defaultValue"
              checked={setting.defaultValue}
              onCheckedChange={checked => updateSetting({ defaultValue: Boolean(checked) })}
            />
            <Label htmlFor="defaultValue">Default Value (Enabled)</Label>
          </div>
        );

      case 'select':
        return (
          <>
            <div>
              <Label>Select Options</Label>
              <div className="space-y-2">
                {setting.selectList.map(option => (
                  <div key={option.id} className="flex items-center gap-2">
                    <Input value={option.id} readOnly className="flex-1" />
                    <Input value={option.value} readOnly className="flex-1" />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeSelectOption(option.id)}
                      className="text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Option ID"
                    value={newSelectOption.id}
                    onChange={e => setNewSelectOption({ ...newSelectOption, id: e.target.value })}
                  />
                  <Input
                    placeholder="Option Value"
                    value={newSelectOption.value}
                    onChange={e =>
                      setNewSelectOption({ ...newSelectOption, value: e.target.value })
                    }
                  />
                  <Button
                    onClick={addSelectOption}
                    disabled={!newSelectOption.id || !newSelectOption.value}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            <div>
              <Label htmlFor="defaultValue">Default Value</Label>
              <Select
                value={setting.defaultValue}
                onValueChange={value => updateSetting({ defaultValue: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select default option" />
                </SelectTrigger>
                <SelectContent>
                  {setting.selectList.map(option => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case 'number':
        return (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="min">Min Value (Optional)</Label>
                <Input
                  id="min"
                  type="number"
                  value={setting.min || ''}
                  onChange={e =>
                    updateSetting({ min: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
              <div>
                <Label htmlFor="max">Max Value (Optional)</Label>
                <Input
                  id="max"
                  type="number"
                  value={setting.max || ''}
                  onChange={e =>
                    updateSetting({ max: e.target.value ? Number(e.target.value) : undefined })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="defaultValue">Default Value</Label>
              <Input
                id="defaultValue"
                type="number"
                value={setting.defaultValue}
                onChange={e => updateSetting({ defaultValue: Number(e.target.value) })}
              />
            </div>
          </>
        );

      case 'string':
        return (
          <div>
            <Label htmlFor="defaultValue">Default Value</Label>
            <Input
              id="defaultValue"
              value={setting.defaultValue}
              onChange={e => updateSetting({ defaultValue: e.target.value })}
            />
          </div>
        );

      case 'color':
        return (
          <div>
            <Label htmlFor="defaultValue">Default Value</Label>
            <div className="flex items-center gap-2">
              <Input
                id="defaultValue"
                type="color"
                value={setting.defaultValue}
                onChange={e => updateSetting({ defaultValue: e.target.value })}
                className="h-10 w-16 p-1"
              />
              <Input
                value={setting.defaultValue}
                onChange={e => updateSetting({ defaultValue: e.target.value })}
                placeholder="#000000"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="id">Setting ID</Label>
          <Input
            id="id"
            value={setting.id}
            onChange={e => updateSetting({ id: e.target.value })}
            placeholder="unique_setting_id"
          />
        </div>
        <div>
          <Label htmlFor="name">Display Name</Label>
          <Input
            id="name"
            value={setting.name}
            onChange={e => updateSetting({ name: e.target.value })}
            placeholder="Setting Name"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="group">Group (Optional)</Label>
        <Input
          id="group"
          value={setting.group || ''}
          onChange={e => updateSetting({ group: e.target.value || null })}
          placeholder="Settings group name"
        />
      </div>

      {renderTypeSpecificFields()}

      <div>
        <div className="mb-2 flex items-center gap-2">
          <Label>Required Fields</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>
                Required fields help determine if this setting is supported in a specific game. For
                example, an iRacing-specific setting won't be shown when playing Assetto Corsa.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="space-y-2">
          {setting.requiredFields.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {setting.requiredFields.map(field => (
                <Badge
                  key={field}
                  variant="secondary"
                  className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors"
                  onClick={e => {
                    e.stopPropagation();
                    removeRequiredField(field);
                  }}
                >
                  {field}
                  <X className="ml-1 h-3 w-3 cursor-pointer" />
                </Badge>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Input
              placeholder="Add required field"
              value={newRequiredField}
              onChange={e => setNewRequiredField(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && addRequiredField()}
            />
            <Button onClick={addRequiredField} disabled={!newRequiredField}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
