import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Download } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/renderer/components/ui/badge';
import { Button } from '@/renderer/components/ui/button';
import { Card } from '@/renderer/components/ui/card';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { HTTP_SERVER_PORT } from '@/shared/constants';
import { OverlayExtended } from '@/shared/types/OverlayExtended';

interface OverlaySelectorProps {
  isOpen: boolean;
  close: () => void;
  overlays: OverlayExtended[];
  isLoading: boolean;
  error: Error | null;
}

const OverlaySelector = ({ isOpen, close, overlays }: OverlaySelectorProps) => {
  const [selectedOverlay, setSelectedOverlay] = useState<OverlayExtended | null>(null);

  const handleOverlayClick = (overlay: OverlayExtended) => {
    setSelectedOverlay(overlay);
  };

  const closePopup = () => {
    setSelectedOverlay(null);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="bg-background/95 absolute inset-0 z-30 backdrop-blur-sm"
        >
          <ScrollArea className="h-full w-full">
            <div className="container mx-auto max-w-7xl p-4 sm:p-6">
              <div className="mb-4 flex flex-col justify-between gap-4 sm:mb-6 sm:flex-row sm:items-center">
                <div>
                  <h1 className="text-2xl font-bold sm:text-3xl">Overlay Selector</h1>
                  <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                    Choose from our collection of gaming overlays
                  </p>
                </div>
                <Button variant="outline" size="icon" onClick={close}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <OverlayGrid overlays={overlays} onOverlayClick={handleOverlayClick} />
            </div>
          </ScrollArea>

          {/* Overlay Preview Popup */}
          <AnimatePresence>
            {selectedOverlay && (
              <OverlayPreviewPopup overlay={selectedOverlay} onClose={closePopup} />
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface OverlayGridProps {
  overlays: OverlayExtended[];
  onOverlayClick: (overlay: OverlayExtended) => void;
}

const OverlayGrid = ({ overlays, onOverlayClick }: OverlayGridProps) => {
  return (
    <div
      className="grid gap-3 sm:gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
        maxWidth: '100%',
      }}
    >
      {overlays.map(overlay => (
        <OverlayItem
          key={overlay.folderName}
          overlay={overlay}
          onClick={() => onOverlayClick(overlay)}
        />
      ))}
    </div>
  );
};

interface OverlayItemProps {
  overlay: OverlayExtended;
  onClick: () => void;
}

const OverlayItem = ({ overlay, onClick }: OverlayItemProps) => {
  if (!overlay.manifest) return;
  const subscriptionCount = overlay.workshop?.statistics.numUniqueSubscriptions?.toLocaleString();
  const title = overlay.workshop?.title || overlay.manifest.title;
  const dimentions = `${overlay.manifest.dimentions.defaultWidth} x ${overlay.manifest.dimentions.defaultHeight}`;

  return (
    <Card
      className="group bg-card hover:bg-accent/50 hover:border-primary/50 cursor-pointer border-2 p-0 transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        {/* Image */}
        <img
          src={
            overlay.workshop?.previewUrl ||
            `http://localhost:${HTTP_SERVER_PORT}/assets/images/placeholder.png`
          }
          alt={title}
          className="h-full w-full rounded-t-md object-cover transition-transform group-hover:scale-105"
        />

        {/* Overlay info */}
        <div className="absolute inset-0 rounded-t-md bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Text overlay at the bottom */}
        <div className="absolute right-0 bottom-0 left-0 p-3 sm:p-4">
          <div className="space-y-1 sm:space-y-2">
            <h3 className="line-clamp-2 text-xs font-semibold text-white drop-shadow-lg sm:text-sm">
              {title}
            </h3>
            {/* <p className="text-xs text-white/80 drop-shadow">by {overlay.author}</p> */}
            <div className="flex items-center gap-2 text-xs text-white/70 sm:gap-3">
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                <span className="hidden sm:inline">{subscriptionCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Resolution badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {dimentions}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

interface OverlayPreviewPopupProps {
  overlay: OverlayExtended;
  onClose: () => void;
}

const OverlayPreviewPopup = ({ overlay, onClose }: OverlayPreviewPopupProps) => {
  if (!overlay.manifest) return;
  const title = overlay.workshop?.title || overlay.manifest.title;
  const dimentions = `${overlay.manifest.dimentions.defaultWidth} x ${overlay.manifest.dimentions.defaultHeight}`;
  const subscriptionCount = overlay.workshop?.statistics.numUniqueSubscriptions?.toLocaleString();
  const description = overlay.workshop?.description || overlay.manifest.description;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="bg-background max-h-[90vh] w-full max-w-4xl rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <ScrollArea className="max-h-[90vh]">
          <div className="p-4 sm:p-6">
            <div className="mb-4 flex flex-col justify-between gap-4 sm:mb-6 sm:flex-row sm:items-start">
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">{title}</h2>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {/* by {overlay.manifest.title} */}
                </p>
              </div>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
              {/* Preview Section */}
              <div className="order-2 space-y-4 lg:order-1">
                <div className="bg-muted border-muted-foreground/25 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed">
                  <div className="text-muted-foreground text-center">
                    <Monitor className="mx-auto mb-2 h-8 w-8 sm:h-12 sm:w-12" />
                    <p className="text-xs sm:text-sm">Iframe Preview Space</p>
                    <p className="text-xs">Overlay will be loaded here</p>
                  </div>
                </div>

                <img
                  src={
                    overlay.workshop?.previewUrl ||
                    `http://localhost:${HTTP_SERVER_PORT}/assets/images/placeholder.png`
                  }
                  alt={title}
                  className="aspect-square w-full rounded-lg object-cover"
                />
              </div>

              {/* Details Section */}
              <div className="order-1 space-y-4 sm:space-y-6 lg:order-2">
                <div>
                  <h3 className="mb-2 text-sm font-semibold sm:text-base">Description</h3>
                  <p className="text-muted-foreground text-xs sm:text-sm">{description}</p>
                </div>

                <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Monitor className="h-4 w-4" />
                    Resolution
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {dimentions}
                  </Badge>
                </div>

                {/* <div>
                  <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold sm:text-base">
                    <Gamepad2 className="h-4 w-4" />
                    Supported Games
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {overlay.supportedGames.map(game => (
                      <Badge key={game} variant="secondary" className="text-xs">
                        {game}
                      </Badge>
                    ))}
                  </div>
                </div> */}

                <div>
                  <h3 className="mb-2 text-sm font-semibold sm:text-base">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {overlay.manifest.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {subscriptionCount && (
                  <div className="grid grid-cols-2 gap-4 border-t pt-4">
                    <div className="text-center">
                      <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                        <Download className="h-4 w-4" />
                        <span className="text-xs sm:text-sm">Downloads</span>
                      </div>
                      <p className="text-sm font-semibold sm:text-base">{subscriptionCount}</p>
                    </div>
                    {/* <div className="text-center">
                    <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                      <Eye className="h-4 w-4" />
                      <span className="text-xs sm:text-sm">Views</span>
                    </div>
                    <p className="text-sm font-semibold sm:text-base">
                      {overlay.views.toLocaleString()}
                    </p>
                  </div> */}
                  </div>
                )}

                <div className="flex flex-col gap-2 pt-4 sm:flex-row">
                  <Button className="flex-1 text-sm">Select Overlay</Button>
                  <Button variant="outline" className="bg-transparent text-sm">
                    Preview
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </motion.div>
    </motion.div>
  );
};

export default OverlaySelector;
