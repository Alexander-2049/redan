import { useEffect, useState } from 'react';

import { Input } from '@/renderer/components/ui/input';
import { Label } from '@/renderer/components/ui/label';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface DimensionInputsProps {
  dimensions: OverlayManifestFile['dimentions'];
  errors: Record<string, string>;
  onUpdate: (key: keyof OverlayManifestFile['dimentions'], value: number) => void;
}

export const DimensionInputs = ({ dimensions, errors, onUpdate }: DimensionInputsProps) => {
  const [inputValues, setInputValues] = useState<
    Record<keyof OverlayManifestFile['dimentions'], string>
  >({
    minWidth: dimensions.minWidth.toString(),
    defaultWidth: dimensions.defaultWidth.toString(),
    maxWidth: dimensions.maxWidth.toString(),
    minHeight: dimensions.minHeight.toString(),
    defaultHeight: dimensions.defaultHeight.toString(),
    maxHeight: dimensions.maxHeight.toString(),
  });

  // Sync internal string values if manifest changes externally
  useEffect(() => {
    setInputValues({
      minWidth: dimensions.minWidth.toString(),
      defaultWidth: dimensions.defaultWidth.toString(),
      maxWidth: dimensions.maxWidth.toString(),
      minHeight: dimensions.minHeight.toString(),
      defaultHeight: dimensions.defaultHeight.toString(),
      maxHeight: dimensions.maxHeight.toString(),
    });
  }, [dimensions]);

  const handleChange = (key: keyof typeof inputValues, value: string) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  const handleBlur = (key: keyof typeof inputValues) => {
    const stringValue = inputValues[key];
    const parsed = parseFloat(stringValue);
    if (!isNaN(parsed)) {
      onUpdate(key, parsed);
    } else {
      setInputValues(prev => ({
        ...prev,
        [key]: dimensions[key].toString(),
      }));
    }
  };

  const renderInput = (label: string, key: keyof typeof inputValues, tabIndex: number) => (
    <div>
      <Label htmlFor={key}>{label}</Label>
      <Input
        id={key}
        type="number"
        tabIndex={tabIndex}
        value={inputValues[key]}
        onChange={e => handleChange(key, e.target.value)}
        onBlur={() => handleBlur(key)}
        className={errors[key] ? 'border-red-500' : ''}
      />
      {errors[key] && <p className="mt-1 text-sm text-red-500">{errors[key]}</p>}
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="font-medium">Width</h4>
        <div className="space-y-3">
          {renderInput('Min Width', 'minWidth', 1)}
          {renderInput('Default Width', 'defaultWidth', 3)}
          {renderInput('Max Width', 'maxWidth', 5)}
        </div>
      </div>
      <div className="space-y-4">
        <h4 className="font-medium">Height</h4>
        <div className="space-y-3">
          {renderInput('Min Height', 'minHeight', 2)}
          {renderInput('Default Height', 'defaultHeight', 4)}
          {renderInput('Max Height', 'maxHeight', 6)}
        </div>
      </div>
    </div>
  );
};
