import type React from 'react';
import { toast } from 'sonner';

import { overlayManifestFileSchema } from '@/shared/schemas/overlayManifestFileSchema';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

export const useFileImport = (onManifestChange: (manifest: OverlayManifestFile) => void) => {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const content = e.target?.result as string;
        const jsonData = JSON.parse(content) as unknown;

        // Validate the manifest using the schema
        const validatedManifest = overlayManifestFileSchema.parse(jsonData);

        onManifestChange(validatedManifest);
        toast.success('Manifest Imported', {
          description: 'The manifest file has been successfully imported and validated.',
        });
      } catch (error) {
        if (error instanceof SyntaxError) {
          toast.error('Invalid JSON File', {
            description: 'The selected file contains invalid JSON syntax.',
          });
        } else {
          toast.error('Invalid Manifest File', {
            description: 'The manifest file does not match the required schema format.',
          });
        }
      }
    };

    reader.onerror = () => {
      toast.error('File Read Error', {
        description: 'Failed to read the selected file. Please try again.',
      });
    };

    reader.readAsText(file);

    // Reset the input so the same file can be selected again
    event.target.value = '';
  };

  return { handleFileChange };
};
