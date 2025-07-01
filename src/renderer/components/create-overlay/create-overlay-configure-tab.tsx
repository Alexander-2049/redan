import type React from 'react';
import { useState } from 'react';

import { useManifestValidation } from '@/renderer/components/create-overlay/hooks/use-manifest-validation';
import { BasicInfoSection } from '@/renderer/components/create-overlay/sections/basic-info-section';
import { ConfigureHeader } from '@/renderer/components/create-overlay/sections/configure-header';
import { DimensionsSection } from '@/renderer/components/create-overlay/sections/dimensions-section';
import { JsonPreviewSection } from '@/renderer/components/create-overlay/sections/json-preview-section';
import { TagsSection } from '@/renderer/components/create-overlay/sections/tags-section';
import { TooltipProvider } from '@/renderer/components/ui/tooltip';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface CreateOverlayConfigureTabProps {
  manifest: OverlayManifestFile;
  onManifestChange: (manifest: OverlayManifestFile) => void;
}

const CreateOverlayConfigureTab = ({
  manifest,
  onManifestChange,
}: CreateOverlayConfigureTabProps) => {
  const [newTag, setNewTag] = useState('');
  const { errors, validateDimensions } = useManifestValidation();

  const updateManifest = (updates: Partial<OverlayManifestFile>) => {
    onManifestChange({ ...manifest, ...updates });
  };

  return (
    <TooltipProvider>
      <div>
        <ConfigureHeader onManifestChange={onManifestChange} />

        <div className="space-y-6">
          <BasicInfoSection manifest={manifest} onUpdate={updateManifest} />

          <TagsSection
            manifest={manifest}
            onUpdate={updateManifest}
            newTag={newTag}
            setNewTag={setNewTag}
          />

          <DimensionsSection
            manifest={manifest}
            onUpdate={updateManifest}
            errors={errors}
            onValidate={validateDimensions}
          />

          <JsonPreviewSection manifest={manifest} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CreateOverlayConfigureTab;
