import { Checkbox } from '../../ui/checkbox';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Slider } from '../../ui/slider';

import type { OverlayManifestSettingType } from '@/shared/types/OverlaySettingDescription';
import type { SettingValue } from '@/shared/types/SettingValue';

interface SettingControlProps {
  setting: OverlayManifestSettingType;
  value: SettingValue;
  onChange: (value: SettingValue) => void;
}

export const SettingControl = ({ setting, value, onChange }: SettingControlProps) => {
  const renderControl = () => {
    switch (setting.type) {
      case 'slider':
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={setting.id}>{setting.name}</Label>
              <span className="text-muted-foreground text-sm">
                {value}
                {setting.unit === 'percentage' && '%'}
              </span>
            </div>
            <Slider
              id={setting.id}
              min={setting.min}
              max={setting.max}
              step={setting.step}
              value={[typeof value === 'number' ? value : setting.defaultValue]}
              onValueChange={values => onChange(values[0])}
              className="w-full"
            />
          </div>
        );

      case 'toggle':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={setting.id}
              checked={typeof value === 'boolean' ? value : setting.defaultValue}
              onCheckedChange={checked => onChange(Boolean(checked))}
            />
            <Label htmlFor={setting.id}>{setting.name}</Label>
          </div>
        );

      case 'select':
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.id}>{setting.name}</Label>
            <Select
              value={typeof value === 'string' ? value : setting.defaultValue}
              onValueChange={newValue => onChange(newValue)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an option" />
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
        );

      case 'number':
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.id}>{setting.name}</Label>
            <Input
              id={setting.id}
              type="number"
              value={typeof value === 'number' ? value : setting.defaultValue}
              onChange={e => onChange(Number(e.target.value))}
              min={setting.min}
              max={setting.max}
            />
          </div>
        );

      case 'string':
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.id}>{setting.name}</Label>
            <Input
              id={setting.id}
              value={typeof value === 'string' ? value : setting.defaultValue}
              onChange={e => onChange(e.target.value)}
            />
          </div>
        );

      case 'color':
        return (
          <div className="space-y-2">
            <Label htmlFor={setting.id}>{setting.name}</Label>
            <div className="flex items-center gap-2">
              <Input
                id={setting.id}
                type="color"
                value={typeof value === 'string' ? value : setting.defaultValue}
                onChange={e => onChange(e.target.value)}
                className="h-10 w-16 p-1"
              />
              <Input
                value={typeof value === 'string' ? value : setting.defaultValue}
                onChange={e => onChange(e.target.value)}
                placeholder="#000000"
                className="flex-1"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return renderControl();
};
