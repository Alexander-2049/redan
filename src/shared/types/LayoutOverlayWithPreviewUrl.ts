import { LayoutOverlay } from '@/main/shared/types/LayoutOverlay';

export interface LayoutOverlayWithPreviewUrl extends LayoutOverlay {
  previewUrl?: string;
}
