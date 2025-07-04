import { useState, useRef, useCallback } from 'react';
import { toast } from 'sonner';

import { generateOverlayUrl } from '../utils/overlay-utils';

import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

export const useOverlayWindow = (manifest: OverlayManifestFile, baseUrl: string) => {
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const overlayWindowRef = useRef<Window | null>(null);

  const openOverlay = useCallback(() => {
    if (isOverlayOpen && overlayWindowRef.current && !overlayWindowRef.current.closed) {
      overlayWindowRef.current.focus();
      return;
    }

    setIsLoading(true);

    try {
      const overlayUrl = generateOverlayUrl(manifest, baseUrl);

      // Try to use Electron API first, fallback to window.open
      if (window.overlay?.open) {
        // Use Electron API when available
        void window.overlay.open(overlayUrl);
        setIsOverlayOpen(true);

        toast.success('Overlay Opened', {
          description: 'The overlay has been opened using Electron API.',
        });
      } else {
        // Fallback to window.open for development
        const windowFeatures = [
          `width=${manifest.dimentions.defaultWidth}`,
          `height=${manifest.dimentions.defaultHeight}`,
          'resizable=yes',
          'scrollbars=no',
          'toolbar=no',
          'menubar=no',
          'location=no',
          'status=no',
        ].join(',');

        const overlayWindow = window.open(overlayUrl, 'overlay-window', windowFeatures);

        if (!overlayWindow) {
          throw new Error('Failed to open overlay window. Please check popup blocker settings.');
        }

        overlayWindowRef.current = overlayWindow;
        setIsOverlayOpen(true);

        // Monitor window close
        const checkClosed = setInterval(() => {
          if (overlayWindow.closed) {
            setIsOverlayOpen(false);
            clearInterval(checkClosed);
            overlayWindowRef.current = null;
          }
        }, 1000);

        toast.success('Overlay Opened', {
          description: 'The overlay window has been opened successfully (fallback mode).',
        });
      }
    } catch (error) {
      toast.error('Failed to Open Overlay', {
        description: error instanceof Error ? error.message : 'Unknown error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  }, [manifest, baseUrl, isOverlayOpen]);

  const closeOverlay = useCallback(() => {
    // Try to use Electron API first, fallback to window close
    if (window.overlay?.close) {
      void window.overlay.close();
      setIsOverlayOpen(false);

      toast.success('Overlay Closed', {
        description: 'The overlay has been closed using Electron API.',
      });
    } else if (overlayWindowRef.current && !overlayWindowRef.current.closed) {
      overlayWindowRef.current.close();
      overlayWindowRef.current = null;
      setIsOverlayOpen(false);

      toast.success('Overlay Closed', {
        description: 'The overlay window has been closed.',
      });
    }
  }, []);

  return {
    isOverlayOpen,
    overlayWindow: overlayWindowRef.current,
    openOverlay,
    closeOverlay,
    isLoading,
  };
};
