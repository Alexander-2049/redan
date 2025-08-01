'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Monitor, Gamepad2, Download, Eye } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/renderer/components/ui/badge';
import { Button } from '@/renderer/components/ui/button';
import { Card } from '@/renderer/components/ui/card';
import { cn } from '@/renderer/lib/utils';

interface Overlay {
  id: string;
  title: string;
  author: string;
  image: string;
  resolution: string;
  supportedGames: string[];
  downloads: number;
  views: number;
  tags: string[];
  description: string;
}

interface OverlaySelectorProps {
  isOpen: boolean;
  close: () => void;
}

// Mock data for overlays
const mockOverlays: Overlay[] = [
  {
    id: '1',
    title: 'Gaming HUD Pro',
    author: 'OverlayMaster',
    image: '/placeholder.svg?height=300&width=300',
    resolution: '1920x1080',
    supportedGames: ['CS2', 'Valorant', 'Apex Legends'],
    downloads: 15420,
    views: 45230,
    tags: ['HUD', 'Gaming', 'Professional'],
    description: 'Professional gaming overlay with customizable HUD elements',
  },
  {
    id: '2',
    title: 'Stream Overlay Minimal',
    author: 'StreamDesign',
    image: '/placeholder.svg?height=300&width=300',
    resolution: '1920x1080',
    supportedGames: ['Universal'],
    downloads: 8930,
    views: 23450,
    tags: ['Minimal', 'Streaming', 'Clean'],
    description: 'Clean and minimal overlay perfect for streaming',
  },
  {
    id: '3',
    title: 'Neon Gaming Frame',
    author: 'NeonDesigns',
    image: '/placeholder.svg?height=300&width=300',
    resolution: '2560x1440',
    supportedGames: ['Fortnite', 'Call of Duty', 'Overwatch'],
    downloads: 12340,
    views: 34560,
    tags: ['Neon', 'Colorful', 'Modern'],
    description: 'Vibrant neon-themed overlay with animated elements',
  },
  {
    id: '4',
    title: 'Retro Arcade Style',
    author: 'RetroGamer',
    image: '/placeholder.svg?height=300&width=300',
    resolution: '1920x1080',
    supportedGames: ['Indie Games', 'Retro Games'],
    downloads: 6780,
    views: 18920,
    tags: ['Retro', 'Arcade', 'Pixel'],
    description: 'Nostalgic retro arcade-style overlay',
  },
  {
    id: '5',
    title: 'Cyberpunk Interface',
    author: 'CyberDesign',
    image: '/placeholder.svg?height=300&width=300',
    resolution: '3840x2160',
    supportedGames: ['Cyberpunk 2077', 'Deus Ex', 'Shadowrun'],
    downloads: 9870,
    views: 27340,
    tags: ['Cyberpunk', 'Futuristic', 'Dark'],
    description: 'Futuristic cyberpunk-themed interface overlay',
  },
  {
    id: '6',
    title: 'Sports Broadcast',
    author: 'SportsCaster',
    image: '/placeholder.svg?height=300&width=300',
    resolution: '1920x1080',
    supportedGames: ['FIFA', 'NBA 2K', 'Madden'],
    downloads: 4560,
    views: 12890,
    tags: ['Sports', 'Broadcast', 'Professional'],
    description: 'Professional sports broadcast overlay template',
  },
];

const OverlaySelector = ({ isOpen, close }: OverlaySelectorProps) => {
  const [selectedOverlay, setSelectedOverlay] = useState<Overlay | null>(null);

  const handleOverlayClick = (overlay: Overlay) => {
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
          className={cn('bg-background/95 fixed z-30 h-full w-full overflow-auto backdrop-blur-sm')}
        >
          <div className="container mx-auto max-w-7xl p-6">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold">Overlay Selector</h1>
                <p className="text-muted-foreground mt-1">
                  Choose from our collection of gaming overlays
                </p>
              </div>
              <Button variant="outline" size="icon" onClick={close}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <OverlayGrid overlays={mockOverlays} onOverlayClick={handleOverlayClick} />
          </div>

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
  overlays: Overlay[];
  onOverlayClick: (overlay: Overlay) => void;
}

const OverlayGrid = ({ overlays, onOverlayClick }: OverlayGridProps) => {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        maxWidth: '100%',
      }}
    >
      {overlays.map(overlay => (
        <OverlayItem key={overlay.id} overlay={overlay} onClick={() => onOverlayClick(overlay)} />
      ))}
    </div>
  );
};

interface OverlayItemProps {
  overlay: Overlay;
  onClick: () => void;
}

const OverlayItem = ({ overlay, onClick }: OverlayItemProps) => {
  return (
    <Card
      className="group bg-card hover:bg-accent/50 hover:border-primary/50 cursor-pointer overflow-hidden border-2 p-0 transition-all hover:shadow-lg"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        {/* Image */}
        <img
          src={overlay.image || '/placeholder.svg'}
          alt={overlay.title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Overlay info */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* Text overlay at the bottom */}
        <div className="absolute right-0 bottom-0 left-0 p-4">
          <div className="space-y-2">
            <h3 className="line-clamp-2 text-sm font-semibold text-white drop-shadow-lg">
              {overlay.title}
            </h3>
            <p className="text-xs text-white/80 drop-shadow">by {overlay.author}</p>
            <div className="flex items-center gap-3 text-xs text-white/70">
              <div className="flex items-center gap-1">
                <Download className="h-3 w-3" />
                {overlay.downloads.toLocaleString()}
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                {overlay.views.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        {/* Resolution badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="text-xs">
            {overlay.resolution}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

interface OverlayPreviewPopupProps {
  overlay: Overlay;
  onClose: () => void;
}

const OverlayPreviewPopup = ({ overlay, onClose }: OverlayPreviewPopupProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', duration: 0.3 }}
        className="bg-background max-h-[80vh] w-full max-w-4xl overflow-auto rounded-lg shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold">{overlay.title}</h2>
              <p className="text-muted-foreground">by {overlay.author}</p>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Preview Section */}
            <div className="space-y-4">
              <div className="bg-muted border-muted-foreground/25 flex aspect-square items-center justify-center rounded-lg border-2 border-dashed">
                <div className="text-muted-foreground text-center">
                  <Monitor className="mx-auto mb-2 h-12 w-12" />
                  <p className="text-sm">Iframe Preview Space</p>
                  <p className="text-xs">Overlay will be loaded here</p>
                </div>
              </div>

              <img
                src={overlay.image || '/placeholder.svg'}
                alt={overlay.title}
                className="aspect-square w-full rounded-lg object-cover"
              />
            </div>

            {/* Details Section */}
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 font-semibold">Description</h3>
                <p className="text-muted-foreground text-sm">{overlay.description}</p>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <Monitor className="h-4 w-4" />
                  Resolution
                </h3>
                <Badge variant="outline">{overlay.resolution}</Badge>
              </div>

              <div>
                <h3 className="mb-2 flex items-center gap-2 font-semibold">
                  <Gamepad2 className="h-4 w-4" />
                  Supported Games
                </h3>
                <div className="flex flex-wrap gap-2">
                  {overlay.supportedGames.map(game => (
                    <Badge key={game} variant="secondary">
                      {game}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-semibold">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {overlay.tags.map(tag => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t pt-4">
                <div className="text-center">
                  <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <Download className="h-4 w-4" />
                    <span className="text-sm">Downloads</span>
                  </div>
                  <p className="font-semibold">{overlay.downloads.toLocaleString()}</p>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground mb-1 flex items-center justify-center gap-1">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm">Views</span>
                  </div>
                  <p className="font-semibold">{overlay.views.toLocaleString()}</p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button className="flex-1">Select Overlay</Button>
                <Button variant="outline">Preview</Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OverlaySelector;
