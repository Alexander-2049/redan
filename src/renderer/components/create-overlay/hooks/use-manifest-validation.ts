import { useState } from 'react';

import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

export const useManifestValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDimensions = (dimensions: OverlayManifestFile['dimentions']) => {
    const newErrors: Record<string, string> = {};

    // Min/Max validation
    if (dimensions.minWidth > dimensions.maxWidth) {
      newErrors.minWidth = 'Min width cannot be larger than max width';
      newErrors.maxWidth = 'Max width cannot be smaller than min width';
    }
    if (dimensions.minHeight > dimensions.maxHeight) {
      newErrors.minHeight = 'Min height cannot be larger than max height';
      newErrors.maxHeight = 'Max height cannot be smaller than min height';
    }

    // Default value validation
    if (
      dimensions.defaultWidth < dimensions.minWidth ||
      dimensions.defaultWidth > dimensions.maxWidth
    ) {
      newErrors.defaultWidth = `Default width must be between ${dimensions.minWidth} and ${dimensions.maxWidth}`;
    }
    if (
      dimensions.defaultHeight < dimensions.minHeight ||
      dimensions.defaultHeight > dimensions.maxHeight
    ) {
      newErrors.defaultHeight = `Default height must be between ${dimensions.minHeight} and ${dimensions.maxHeight}`;
    }

    // Range validation
    if (dimensions.minWidth < 20 || dimensions.minWidth > 1920) {
      newErrors.minWidth = 'Min width must be between 20 and 1920';
    }
    if (dimensions.maxWidth < 20 || dimensions.maxWidth > 1920) {
      newErrors.maxWidth = 'Max width must be between 20 and 1920';
    }
    if (dimensions.minHeight < 20 || dimensions.minHeight > 1920) {
      newErrors.minHeight = 'Min height must be between 20 and 1920';
    }
    if (dimensions.maxHeight < 20 || dimensions.maxHeight > 1920) {
      newErrors.maxHeight = 'Max height must be between 20 and 1920';
    }

    setErrors(newErrors);
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validateDimensions,
    clearErrors,
  };
};
