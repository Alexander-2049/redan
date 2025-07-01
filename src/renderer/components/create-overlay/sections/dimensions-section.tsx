import { HelpCircle } from 'lucide-react';

import { DimensionInputs } from '@/renderer/components/create-overlay/components/dimension-inputs';
import { DimensionVisualization } from '@/renderer/components/create-overlay/components/dimension-visualization';
import { Card, CardContent, CardHeader, CardTitle } from '@/renderer/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/renderer/components/ui/tooltip';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface DimensionsSectionProps {
  manifest: OverlayManifestFile;
  onUpdate: (updates: Partial<OverlayManifestFile>) => void;
  errors: Record<string, string>;
  onValidate: (dimensions: OverlayManifestFile['dimentions']) => void;
}

export const DimensionsSection = ({
  manifest,
  onUpdate,
  errors,
  onValidate,
}: DimensionsSectionProps) => {
  const updateDimensions = (key: keyof OverlayManifestFile['dimentions'], value: number) => {
    const newDimensions = { ...manifest.dimentions, [key]: value };
    onUpdate({ dimentions: newDimensions });
    onValidate(newDimensions);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Dimensions
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Define the size constraints and default size for your overlay</p>
            </TooltipContent>
          </Tooltip>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <DimensionVisualization dimensions={manifest.dimentions} />
        <DimensionInputs
          dimensions={manifest.dimentions}
          errors={errors}
          onUpdate={updateDimensions}
        />
      </CardContent>
    </Card>
  );
};
