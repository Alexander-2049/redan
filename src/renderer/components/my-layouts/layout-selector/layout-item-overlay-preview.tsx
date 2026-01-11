import { useEffect, useRef, useState } from 'react';

import { LayoutFile } from '@/shared/types/LayoutFile';

interface ExtendedLayoutFile extends LayoutFile {
  filename: string;
}

interface LayoutItemOverlayPreviewProps {
  layout: ExtendedLayoutFile;
}

export const LayoutItemOverlayPreview = ({ layout }: LayoutItemOverlayPreviewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState<number>(0);
  const ratio = width / layout.screen.width;

  useEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current === null) return;
      setWidth(containerRef.current.offsetWidth);
    };

    updateWidth(); // initial read
    window.addEventListener('resize', updateWidth);

    return () => {
      window.removeEventListener('resize', updateWidth);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-muted/30 relative"
      style={{
        maxWidth: '100%',
        aspectRatio: `${layout.screen.width} / ${layout.screen.height}`,
      }}
    >
      {layout.overlays.map(overlay => {
        const url = `${overlay.baseUrl}?preview=true&${overlay.settings
          .map(s => {
            const key = s.id;
            const value = s.value;

            if (typeof value === 'boolean') {
              return `${encodeURIComponent(key)}=${value ? 'true' : 'false'}`;
            }
            if (typeof value === 'number' || typeof value === 'string') {
              return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
            }
            if (Array.isArray(value)) {
              return `${encodeURIComponent(key)}=${value.map(v => encodeURIComponent(v)).join(',')}`;
            }
            return '';
          })
          .join('&')}`;

        return (
          <iframe
            key={`${overlay.id}-preview`}
            className="pointer-events-none absolute"
            src={url}
            width={overlay.size.width}
            height={overlay.size.height}
            style={{
              transform: `scale(${ratio})`,
              transformOrigin: 'top left',
              left: `${overlay.position.x * ratio}px`,
              top: `${overlay.position.y * ratio}px`,
            }}
          />
        );
      })}
    </div>
  );
};
