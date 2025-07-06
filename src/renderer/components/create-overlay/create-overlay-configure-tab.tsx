import { useState } from 'react';

import { useManifestValidation } from './hooks/use-manifest-validation';
import { BasicInfoSection } from './sections/basic-info-section';
import { ConfigureHeader } from './sections/configure-header';
import { DimensionsSection } from './sections/dimensions-section';
import { FieldsSection } from './sections/fields-section';
import { JsonPreviewSection } from './sections/json-preview-section';
import { SettingsSection } from './sections/settings-section';
import { TagsSection } from './sections/tags-section';

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

          <SettingsSection manifest={manifest} onUpdate={updateManifest} />

          <FieldsSection manifest={manifest} onUpdate={updateManifest} />

          <JsonPreviewSection manifest={manifest} />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default CreateOverlayConfigureTab;
