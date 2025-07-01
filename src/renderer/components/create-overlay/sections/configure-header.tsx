import { RotateCcw, Upload } from 'lucide-react';
import { useRef } from 'react';

import { useFileImport } from '../hooks/use-file-import';

import { Button } from '@/renderer/components/ui/button';
import { createDefaultManifest } from '@/renderer/utils/manifest-utils';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface ConfigureHeaderProps {
  onManifestChange: (manifest: OverlayManifestFile) => void;
}

export const ConfigureHeader = ({ onManifestChange }: ConfigureHeaderProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { handleFileChange } = useFileImport(onManifestChange);

  const handleReset = () => {
    onManifestChange(createDefaultManifest());
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="mb-6 flex items-center justify-between">
      <div></div>
      <div className="flex gap-2">
        <Button variant="outline" onClick={handleReset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Reset All
        </Button>
        <Button variant="outline" onClick={handleImport}>
          <Upload className="mr-2 h-4 w-4" />
          Import Manifest
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
      </div>
    </div>
  );
};
