import { Input } from '@/renderer/components/ui/input';
import { Label } from '@/renderer/components/ui/label';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface DimensionInputsProps {
  dimensions: OverlayManifestFile['dimentions'];
  errors: Record<string, string>;
  onUpdate: (key: keyof OverlayManifestFile['dimentions'], value: string) => void;
}

export const DimensionInputs = ({ dimensions, errors, onUpdate }: DimensionInputsProps) => {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h4 className="font-medium">Width</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="minWidth">Min Width</Label>
            <Input
              id="minWidth"
              type="number"
              tabIndex={1}
              value={dimensions.minWidth}
              onChange={e => onUpdate('minWidth', e.target.value)}
              className={errors.minWidth ? 'border-red-500' : ''}
            />
            {errors.minWidth && <p className="mt-1 text-sm text-red-500">{errors.minWidth}</p>}
          </div>
          <div>
            <Label htmlFor="defaultWidth">Default Width</Label>
            <Input
              id="defaultWidth"
              type="number"
              tabIndex={3}
              value={dimensions.defaultWidth}
              onChange={e => onUpdate('defaultWidth', e.target.value)}
              className={errors.defaultWidth ? 'border-red-500' : ''}
            />
            {errors.defaultWidth && (
              <p className="mt-1 text-sm text-red-500">{errors.defaultWidth}</p>
            )}
          </div>
          <div>
            <Label htmlFor="maxWidth">Max Width</Label>
            <Input
              id="maxWidth"
              type="number"
              tabIndex={5}
              value={dimensions.maxWidth}
              onChange={e => onUpdate('maxWidth', e.target.value)}
              className={errors.maxWidth ? 'border-red-500' : ''}
            />
            {errors.maxWidth && <p className="mt-1 text-sm text-red-500">{errors.maxWidth}</p>}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h4 className="font-medium">Height</h4>
        <div className="space-y-3">
          <div>
            <Label htmlFor="minHeight">Min Height</Label>
            <Input
              id="minHeight"
              type="number"
              tabIndex={2}
              value={dimensions.minHeight}
              onChange={e => onUpdate('minHeight', e.target.value)}
              className={errors.minHeight ? 'border-red-500' : ''}
            />
            {errors.minHeight && <p className="mt-1 text-sm text-red-500">{errors.minHeight}</p>}
          </div>
          <div>
            <Label htmlFor="defaultHeight">Default Height</Label>
            <Input
              id="defaultHeight"
              type="number"
              tabIndex={4}
              value={dimensions.defaultHeight}
              onChange={e => onUpdate('defaultHeight', e.target.value)}
              className={errors.defaultHeight ? 'border-red-500' : ''}
            />
            {errors.defaultHeight && (
              <p className="mt-1 text-sm text-red-500">{errors.defaultHeight}</p>
            )}
          </div>
          <div>
            <Label htmlFor="maxHeight">Max Height</Label>
            <Input
              id="maxHeight"
              type="number"
              tabIndex={6}
              value={dimensions.maxHeight}
              onChange={e => onUpdate('maxHeight', e.target.value)}
              className={errors.maxHeight ? 'border-red-500' : ''}
            />
            {errors.maxHeight && <p className="mt-1 text-sm text-red-500">{errors.maxHeight}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
