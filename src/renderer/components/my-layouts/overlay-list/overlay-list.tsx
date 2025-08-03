import { Trash2, Eye, Plus } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/renderer/components/ui/button';
import { Card } from '@/renderer/components/ui/card';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { cn } from '@/renderer/lib/utils';
import type { LayoutOverlayWithPreviewUrl as LayoutOverlay } from '@/shared/types/LayoutOverlayWithPreviewUrl';

interface OverlayListProps {
  overlays: LayoutOverlay[];
  onOverlayClick: (overlay: LayoutOverlay) => void;
  onDeleteOverlay: (overlayId: string) => void;
  onAddOverlay: () => void;
}

const OverlayList = ({
  overlays,
  onOverlayClick,
  onDeleteOverlay,
  onAddOverlay,
}: OverlayListProps) => {
  const [hoveredOverlay, setHoveredOverlay] = useState<string | null>(null);

  return (
    <div className="bg-accent/50 flex h-full w-80 min-w-0 shrink-0 flex-col border-l">
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">Overlays</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              {overlays.length} overlay{overlays.length !== 1 ? 's' : ''} in this layout
            </p>
          </div>
          <Button onClick={onAddOverlay} size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Add overlay
          </Button>
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="space-y-2 p-2">
          {overlays.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Eye className="text-muted-foreground/50 mb-4 h-12 w-12" />
              <p className="text-muted-foreground font-medium">No overlays added</p>
              <p className="text-muted-foreground mt-1 text-sm">
                Add overlays to your layout to get started
              </p>
            </div>
          ) : (
            overlays.map(overlay => (
              <Card
                key={overlay.id}
                className={cn(
                  'group relative cursor-pointer border-2 p-3 transition-all hover:shadow-md',
                  'bg-card hover:bg-accent/50 hover:border-primary/50',
                )}
                onMouseEnter={() => setHoveredOverlay(overlay.id)}
                onMouseLeave={() => setHoveredOverlay(null)}
                onClick={() => onOverlayClick(overlay)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center gap-2">
                      <h4 className="truncate text-sm font-medium">{overlay.title}</h4>
                    </div>
                    <div className="text-muted-foreground flex items-center gap-4 text-xs">
                      <span>
                        {overlay.size.width}×{overlay.size.height}
                      </span>
                      <span>
                        ({overlay.position.x}, {overlay.position.y})
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        'text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8 p-0 opacity-0 transition-opacity group-hover:opacity-100',
                        hoveredOverlay === overlay.id && 'opacity-100',
                      )}
                      onClick={e => {
                        e.stopPropagation();
                        onDeleteOverlay(overlay.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default OverlayList;
