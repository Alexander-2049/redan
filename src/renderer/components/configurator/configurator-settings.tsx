/* eslint-disable @typescript-eslint/no-explicit-any */
import { Trash2, Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';

import { Badge } from '@/renderer/components/ui/badge';
import { Button } from '@/renderer/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/renderer/components/ui/card';
import { Checkbox } from '@/renderer/components/ui/checkbox';
import { Input } from '@/renderer/components/ui/input';
import { Label } from '@/renderer/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/renderer/components/ui/select';
import { Slider } from '@/renderer/components/ui/slider';

// Types based on the exact Zod schema provided
type SettingType = 'slider' | 'toggle' | 'select' | 'number' | 'string' | 'color';

interface BaseSetting {
  id: string;
  name: string;
  group?: string;
}

interface SliderSetting extends BaseSetting {
  type: 'slider';
  min: number;
  max: number;
  step: number;
  unit?: 'number' | 'percentage';
  defaultValue: number;
}

interface ToggleSetting extends BaseSetting {
  type: 'toggle';
  defaultValue: boolean;
}

interface SelectSetting extends BaseSetting {
  type: 'select';
  selectList: Array<{ id: string; value: string }>;
  defaultValue: string; // id
}

interface NumberSetting extends BaseSetting {
  type: 'number';
  min?: number;
  max?: number;
  defaultValue: number;
}

interface StringSetting extends BaseSetting {
  type: 'string';
  defaultValue: string;
}

interface ColorSetting extends BaseSetting {
  type: 'color';
  defaultValue: string; // hex color
}

type SettingItem =
  | SliderSetting
  | ToggleSetting
  | SelectSetting
  | NumberSetting
  | StringSetting
  | ColorSetting;

interface SettingsConfiguratorProps {
  settings: SettingItem[];
  onSettingsChange: (settings: SettingItem[]) => void;
  disabled?: boolean;
}

export const ConfiguratorSettings: React.FC<SettingsConfiguratorProps> = ({
  settings = [], // Add default empty array
  onSettingsChange,
  disabled = false,
}) => {
  // Ensure settings is always an array
  const safeSettings = Array.isArray(settings) ? settings : [];
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [newSetting, setNewSetting] = useState<{
    id: string;
    name: string;
    type: SettingType;
    group?: string;
  }>({
    id: '',
    name: '',
    type: 'string',
  });

  // Local state for editing to prevent lag
  const [localEditValues, setLocalEditValues] = useState<Record<string, any>>({});
  const debounceTimeouts = useRef<Record<string, NodeJS.Timeout>>({});

  // Initialize local values when editing starts
  useEffect(() => {
    if (editingIndex !== null && safeSettings[editingIndex]) {
      const setting = safeSettings[editingIndex];
      setLocalEditValues({
        name: setting.name,
        group: setting.group || '',
        defaultValue: setting.defaultValue,
        min: setting.type === 'slider' || setting.type === 'number' ? setting.min : '',
        max: setting.type === 'slider' || setting.type === 'number' ? setting.max : '',
        step: setting.type === 'slider' ? setting.step : '',
        unit: setting.type === 'slider' ? setting.unit || 'number' : '',
      });
    }
  }, [editingIndex, safeSettings]);

  const debounceUpdate = (key: string, value: any, updateFn: () => void) => {
    // Clear existing timeout
    if (debounceTimeouts.current[key]) {
      clearTimeout(debounceTimeouts.current[key]);
    }

    // Set new timeout
    debounceTimeouts.current[key] = setTimeout(() => {
      updateFn();
      delete debounceTimeouts.current[key];
    }, 300); // 300ms debounce
  };

  const addSetting = () => {
    if (newSetting.id && newSetting.name && newSetting.type) {
      // Check if ID already exists
      if (safeSettings.some(s => s.id === newSetting.id)) {
        alert('Setting ID must be unique');
        return;
      }

      const baseSetting = {
        id: newSetting.id,
        name: newSetting.name,
        group: newSetting.group || undefined, // Convert empty string to undefined
      };

      let setting: SettingItem;

      switch (newSetting.type) {
        case 'slider':
          setting = {
            ...baseSetting,
            type: 'slider',
            min: 0,
            max: 100,
            step: 1,
            defaultValue: 0, // Required
          } as SliderSetting;
          break;
        case 'toggle':
          setting = {
            ...baseSetting,
            type: 'toggle',
            defaultValue: false, // Required
          } as ToggleSetting;
          break;
        case 'select':
          setting = {
            ...baseSetting,
            type: 'select',
            selectList: [{ id: 'option1', value: 'Option 1' }], // At least one option required
            defaultValue: 'option1', // Required - must match an option ID
          } as SelectSetting;
          break;
        case 'number':
          setting = {
            ...baseSetting,
            type: 'number',
            defaultValue: 0, // Required
          } as NumberSetting;
          break;
        case 'string':
          setting = {
            ...baseSetting,
            type: 'string',
            defaultValue: '', // Required
          } as StringSetting;
          break;
        case 'color':
          setting = {
            ...baseSetting,
            type: 'color',
            defaultValue: '#000000', // Required - must be valid hex
          } as ColorSetting;
          break;
        default:
          return;
      }

      onSettingsChange([...safeSettings, setting]);
      setNewSetting({ id: '', name: '', type: 'string' });
    }
  };

  const removeSetting = (index: number) => {
    const newSettings = safeSettings.filter((_, i) => i !== index);
    onSettingsChange(newSettings);
    setEditingIndex(null);
  };

  const moveSetting = (index: number, direction: 'up' | 'down') => {
    const newSettings = [...safeSettings];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex >= 0 && targetIndex < safeSettings.length) {
      [newSettings[index], newSettings[targetIndex]] = [
        newSettings[targetIndex],
        newSettings[index],
      ];
      onSettingsChange(newSettings);
    }
  };

  // Optimized update function with immediate local state update
  const updateSetting = (
    index: number,
    updates:
      | Partial<SliderSetting>
      | Partial<ToggleSetting>
      | Partial<SelectSetting>
      | Partial<NumberSetting>
      | Partial<StringSetting>
      | Partial<ColorSetting>,
  ) => {
    const newSettings = safeSettings.map((setting, i) => {
      if (i !== index) return setting;
      switch (setting.type) {
        case 'slider':
          return { ...setting, ...(updates as Partial<SliderSetting>) };
        case 'toggle':
          return { ...setting, ...(updates as Partial<ToggleSetting>) };
        case 'select':
          return { ...setting, ...(updates as Partial<SelectSetting>) };
        case 'number':
          return { ...setting, ...(updates as Partial<NumberSetting>) };
        case 'string':
          return { ...setting, ...(updates as Partial<StringSetting>) };
        case 'color':
          return { ...setting, ...(updates as Partial<ColorSetting>) };
        default:
          return setting;
      }
    });
    onSettingsChange(newSettings);
  };

  // Debounced update for text inputs
  const updateSettingDebounced = (index: number, field: string, value: any) => {
    // Update local state immediately
    setLocalEditValues(prev => ({ ...prev, [field]: value }));

    // Debounce the actual update
    debounceUpdate(`${index}-${field}`, value, () => {
      updateSetting(index, { [field]: value });
    });
  };

  const updateSelectOption = (
    settingIndex: number,
    optionIndex: number,
    updates: { id?: string; value?: string },
  ) => {
    const setting = safeSettings[settingIndex];
    if (setting && setting.type === 'select') {
      const newSelectList = setting.selectList.map((option, i) =>
        i === optionIndex ? { ...option, ...updates } : option,
      );

      // If we're updating the ID and it was the default value, update the default too
      const newDefaultValue =
        updates.id && setting.defaultValue === setting.selectList[optionIndex].id
          ? updates.id
          : setting.defaultValue;

      const updatedSetting = {
        ...setting,
        selectList: newSelectList,
        defaultValue: newDefaultValue,
      };

      const newSettings = safeSettings.map((s, i) => (i === settingIndex ? updatedSetting : s));
      onSettingsChange(newSettings);
    }
  };

  const removeSelectOption = (settingIndex: number, optionIndex: number) => {
    const setting = safeSettings[settingIndex];
    if (setting && setting.type === 'select') {
      // Don't allow removing the last option
      if (setting.selectList.length <= 1) {
        alert('Select settings must have at least one option');
        return;
      }

      const optionToRemove = setting.selectList[optionIndex];
      const newSelectList = setting.selectList.filter((_, i) => i !== optionIndex);

      // If we're removing the default option, set default to first remaining option
      const newDefaultValue =
        setting.defaultValue === optionToRemove.id
          ? newSelectList[0]?.id || ''
          : setting.defaultValue;

      const updatedSetting = {
        ...setting,
        selectList: newSelectList,
        defaultValue: newDefaultValue,
      };

      const newSettings = safeSettings.map((s, i) => (i === settingIndex ? updatedSetting : s));
      onSettingsChange(newSettings);
    }
  };

  const validateColorValue = (color: string): boolean => {
    const hexColorRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
    return hexColorRegex.test(color);
  };

  const renderSettingPreview = (setting: SettingItem) => {
    switch (setting.type) {
      case 'slider':
        return (
          <div className="flex items-center gap-4 opacity-50">
            <Label className="min-w-0 flex-shrink-0 text-sm">{setting.name}</Label>
            <div className="min-w-0 flex-1">
              <Slider
                value={[setting.defaultValue]}
                min={setting.min}
                max={setting.max}
                step={setting.step}
                disabled
                className="cursor-not-allowed"
              />
            </div>
            <span className="text-muted-foreground flex-shrink-0 text-xs">
              {setting.defaultValue}
              {setting.unit === 'percentage' ? '%' : ''}
            </span>
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-2 opacity-50">
            <Checkbox checked={setting.defaultValue} disabled />
            <Label className="cursor-not-allowed text-sm">{setting.name}</Label>
          </div>
        );

      case 'select':
        return (
          <div className="flex items-center gap-4 opacity-50">
            <Label className="min-w-0 flex-shrink-0 text-sm">{setting.name}</Label>
            <Select value={setting.defaultValue} disabled>
              <SelectTrigger className="flex-1 cursor-not-allowed">
                <span className="text-sm">
                  {setting.selectList.find(opt => opt.id === setting.defaultValue)?.value ||
                    'Select...'}
                </span>
              </SelectTrigger>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div className="flex items-center gap-4 opacity-50">
            <Label className="min-w-0 flex-shrink-0 text-sm">{setting.name}</Label>
            <Input
              type="number"
              value={setting.defaultValue}
              disabled
              className="flex-1 cursor-not-allowed"
            />
          </div>
        );

      case 'string':
        return (
          <div className="flex items-center gap-4 opacity-50">
            <Label className="min-w-0 flex-shrink-0 text-sm">{setting.name}</Label>
            <Input value={setting.defaultValue} disabled className="flex-1 cursor-not-allowed" />
          </div>
        );

      case 'color':
        return (
          <div className="flex items-center gap-4 opacity-50">
            <Label className="min-w-0 flex-shrink-0 text-sm">{setting.name}</Label>
            <div className="flex flex-1 gap-2">
              <Input
                type="color"
                value={setting.defaultValue}
                disabled
                className="h-10 w-16 cursor-not-allowed"
              />
              <Input value={setting.defaultValue} disabled className="flex-1 cursor-not-allowed" />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const isSettingValid = (setting: SettingItem): boolean => {
    switch (setting.type) {
      case 'slider':
        return setting.defaultValue >= setting.min && setting.defaultValue <= setting.max;
      case 'toggle':
        return typeof setting.defaultValue === 'boolean';
      case 'select':
        return (
          setting.selectList.length > 0 &&
          setting.selectList.some(opt => opt.id === setting.defaultValue)
        );
      case 'number': {
        const numValue = setting.defaultValue;
        return (
          typeof numValue === 'number' &&
          (setting.min === undefined || numValue >= setting.min) &&
          (setting.max === undefined || numValue <= setting.max)
        );
      }
      case 'string':
        return typeof setting.defaultValue === 'string';
      case 'color':
        return validateColorValue(setting.defaultValue);
      default:
        return false;
    }
  };

  const addSelectOption = (settingIndex: number) => {
    const setting = safeSettings[settingIndex];
    if (setting && setting.type === 'select') {
      const newSelectList = [
        ...setting.selectList,
        {
          id: `option${setting.selectList.length + 1}`,
          value: `Option ${setting.selectList.length + 1}`,
        },
      ];

      const updatedSetting = {
        ...setting,
        selectList: newSelectList,
      };

      const newSettings = safeSettings.map((s, i) => (i === settingIndex ? updatedSetting : s));
      onSettingsChange(newSettings);
    }
  };

  return (
    <div className="space-y-6">
      {disabled && (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <p className="text-sm text-yellow-800">
            Settings configuration is disabled while the overlay is running. Close the overlay to
            make changes.
          </p>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Setting</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="setting-id">ID</Label>
              <Input
                id="setting-id"
                value={newSetting.id}
                onChange={e => setNewSetting({ ...newSetting, id: e.target.value })}
                placeholder="unique_id"
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="setting-name">Name</Label>
              <Input
                id="setting-name"
                value={newSetting.name}
                onChange={e => setNewSetting({ ...newSetting, name: e.target.value })}
                placeholder="Display Name"
                disabled={disabled}
              />
            </div>
            <div>
              <Label htmlFor="setting-type">Type</Label>
              <Select
                value={newSetting.type}
                onValueChange={(value: SettingType) =>
                  setNewSetting({ ...newSetting, type: value })
                }
                disabled={disabled}
              >
                <SelectTrigger>
                  <SelectValue />
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
          </div>
          <div>
            <Label htmlFor="setting-group">Group (Optional)</Label>
            <Input
              id="setting-group"
              value={newSetting.group || ''}
              onChange={e => setNewSetting({ ...newSetting, group: e.target.value })}
              placeholder="Group name"
              disabled={disabled}
            />
          </div>
          <Button onClick={addSetting} disabled={!newSetting.id || !newSetting.name || disabled}>
            <Plus className="mr-2 h-4 w-4" />
            Add Setting
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Configured Settings
            <Badge variant="outline">{safeSettings.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {safeSettings.map((setting, index) => (
            <Card key={setting.id} className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex min-w-0 flex-1 items-center gap-2">
                  <Badge variant="secondary">{setting.type}</Badge>
                  <span className="truncate font-medium">{setting.name}</span>
                  <span className="text-muted-foreground text-sm">({setting.id})</span>
                  {setting.group && <Badge variant="outline">{setting.group}</Badge>}
                  {!isSettingValid(setting) && (
                    <Badge variant="destructive" className="text-xs">
                      Invalid
                    </Badge>
                  )}
                </div>
                <div className="flex flex-shrink-0 gap-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveSetting(index, 'up')}
                    disabled={index === 0 || disabled}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => moveSetting(index, 'down')}
                    disabled={index === safeSettings.length - 1 || disabled}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setEditingIndex(editingIndex === index ? null : index)}
                    disabled={disabled}
                  >
                    {editingIndex === index ? 'Done' : 'Edit'}
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeSetting(index)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Setting Preview */}
              <div className="mb-4 rounded border bg-gray-50 p-3">
                <Label className="text-muted-foreground mb-2 block text-xs">
                  Preview (Disabled)
                </Label>
                {renderSettingPreview(setting)}
              </div>

              {editingIndex === index && !disabled && (
                <div className="space-y-4 border-t pt-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <Label>Name</Label>
                      <Input
                        value={localEditValues.name || setting.name}
                        onChange={e => updateSettingDebounced(index, 'name', e.target.value)}
                        onBlur={() =>
                          updateSetting(index, {
                            name: localEditValues.name || setting.name,
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Group</Label>
                      <Input
                        value={
                          localEditValues.group !== undefined
                            ? localEditValues.group
                            : setting.group || ''
                        }
                        onChange={e => updateSettingDebounced(index, 'group', e.target.value)}
                        onBlur={() =>
                          updateSetting(index, {
                            group: localEditValues.group || '',
                          })
                        }
                      />
                    </div>
                  </div>

                  {/* Type-specific fields */}
                  {setting.type === 'slider' && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                      <div>
                        <Label>Min</Label>
                        <Input
                          type="number"
                          value={
                            localEditValues.min !== undefined ? localEditValues.min : setting.min
                          }
                          onChange={e =>
                            updateSettingDebounced(index, 'min', Number(e.target.value))
                          }
                          onBlur={() =>
                            updateSetting(index, {
                              min: Number(localEditValues.min) || setting.min,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Max</Label>
                        <Input
                          type="number"
                          value={
                            localEditValues.max !== undefined ? localEditValues.max : setting.max
                          }
                          onChange={e =>
                            updateSettingDebounced(index, 'max', Number(e.target.value))
                          }
                          onBlur={() =>
                            updateSetting(index, {
                              max: Number(localEditValues.max) || setting.max,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Step</Label>
                        <Input
                          type="number"
                          step="0.1"
                          value={
                            localEditValues.step !== undefined ? localEditValues.step : setting.step
                          }
                          onChange={e =>
                            updateSettingDebounced(index, 'step', Number(e.target.value))
                          }
                          onBlur={() =>
                            updateSetting(index, {
                              step: Number(localEditValues.step) || setting.step,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Unit</Label>
                        <Select
                          value={localEditValues.unit || setting.unit || 'number'}
                          onValueChange={(value: 'number' | 'percentage') =>
                            updateSetting(index, { unit: value })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="percentage">Percentage</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {setting.type === 'number' && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <Label>Min (Optional)</Label>
                        <Input
                          type="number"
                          value={
                            localEditValues.min !== undefined
                              ? localEditValues.min
                              : setting.min || ''
                          }
                          onChange={e =>
                            updateSettingDebounced(
                              index,
                              'min',
                              e.target.value ? Number(e.target.value) : undefined,
                            )
                          }
                          onBlur={() =>
                            updateSetting(index, {
                              min: localEditValues.min ? Number(localEditValues.min) : undefined,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Max (Optional)</Label>
                        <Input
                          type="number"
                          value={
                            localEditValues.max !== undefined
                              ? localEditValues.max
                              : setting.max || ''
                          }
                          onChange={e =>
                            updateSettingDebounced(
                              index,
                              'max',
                              e.target.value ? Number(e.target.value) : undefined,
                            )
                          }
                          onBlur={() =>
                            updateSetting(index, {
                              max: localEditValues.max ? Number(localEditValues.max) : undefined,
                            })
                          }
                        />
                      </div>
                    </div>
                  )}

                  {setting.type === 'select' && (
                    <div>
                      <div className="mb-2 flex items-center justify-between">
                        <Label>Select Options</Label>
                        <Button size="sm" onClick={() => addSelectOption(index)}>
                          <Plus className="mr-2 h-4 w-4" />
                          Add Option
                        </Button>
                      </div>
                      <div className="space-y-2">
                        {setting.selectList.map((option, optionIndex) => (
                          <div key={`${setting.id}-${optionIndex}`} className="flex gap-2">
                            <Input
                              placeholder="Option ID"
                              value={option.id}
                              onChange={e =>
                                updateSelectOption(index, optionIndex, {
                                  id: e.target.value,
                                })
                              }
                            />
                            <Input
                              placeholder="Option Value"
                              value={option.value}
                              onChange={e =>
                                updateSelectOption(index, optionIndex, {
                                  value: e.target.value,
                                })
                              }
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeSelectOption(index, optionIndex)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <Label>Default Value</Label>
                    {setting.type === 'toggle' ? (
                      <div className="mt-2 flex items-center space-x-2">
                        <Checkbox
                          checked={setting.defaultValue}
                          onCheckedChange={checked =>
                            updateSetting(index, { defaultValue: checked })
                          }
                        />
                        <span>{setting.defaultValue ? 'True' : 'False'}</span>
                      </div>
                    ) : setting.type === 'color' ? (
                      <div className="space-y-2">
                        <Input
                          type="color"
                          value={setting.defaultValue}
                          onChange={e => {
                            debounceUpdate(`color-${index}`, e.target.value, () => {
                              updateSetting(index, {
                                defaultValue: e.target.value,
                              });
                            });
                          }}
                        />
                        <Input
                          value={
                            localEditValues.defaultValue !== undefined
                              ? localEditValues.defaultValue
                              : setting.defaultValue
                          }
                          onChange={e => {
                            const value = e.target.value;
                            setLocalEditValues(prev => ({
                              ...prev,
                              defaultValue: value,
                            }));
                            if (value === '' || validateColorValue(value)) {
                              debounceUpdate(`color-text-${index}`, value, () => {
                                updateSetting(index, { defaultValue: value });
                              });
                            }
                          }}
                          placeholder="#000000"
                          pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                        />
                        {setting.defaultValue && !validateColorValue(setting.defaultValue) && (
                          <p className="text-sm text-red-600">Invalid hex color format</p>
                        )}
                      </div>
                    ) : setting.type === 'select' ? (
                      <Select
                        value={setting.defaultValue}
                        onValueChange={value => updateSetting(index, { defaultValue: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {setting.selectList.map(option => (
                            <SelectItem key={option.id} value={option.id}>
                              {option.value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <Input
                        type={
                          setting.type === 'number' || setting.type === 'slider' ? 'number' : 'text'
                        }
                        value={
                          localEditValues.defaultValue !== undefined
                            ? localEditValues.defaultValue
                            : setting.defaultValue
                        }
                        onChange={e => {
                          const value =
                            setting.type === 'number' || setting.type === 'slider'
                              ? Number(e.target.value)
                              : e.target.value;
                          updateSettingDebounced(index, 'defaultValue', value);
                        }}
                        onBlur={() =>
                          updateSetting(index, {
                            defaultValue:
                              localEditValues.defaultValue !== undefined
                                ? localEditValues.defaultValue
                                : setting.defaultValue,
                          })
                        }
                      />
                    )}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
