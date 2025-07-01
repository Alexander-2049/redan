import { toast } from 'sonner';

import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

export const createDefaultManifest = (): OverlayManifestFile => {
  toast.success('Configuration Reset', {
    description: 'All settings have been reset to default values.',
  });

  return {
    title: '',
    description: '',
    tags: [],
    dimentions: {
      defaultWidth: 300,
      defaultHeight: 200,
      minWidth: 100,
      minHeight: 100,
      maxWidth: 800,
      maxHeight: 600,
    },
    settings: [],
    requiredFields: [],
    optionalFields: [],
  };
};
