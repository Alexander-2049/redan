import { motion, AnimatePresence } from 'framer-motion';
// import { X, Save, RotateCcw } from 'lucide-react';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';

import { OverlayManifestFile } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { LayoutOverlay } from '@/main/shared/types/LayoutOverlay';
import { OverlaySettingInLayout } from '@/main/shared/types/LayoutOverlaySetting';
import { SettingValue } from '@/shared/types/SettingValue';

// import { LayoutOverlay } from '@/main/shared/types/LayoutOverlay';
// import { OverlaySettingInLayout } from '@/main/shared/types/LayoutOverlaySetting';
// import OverlayPreview from '@/renderer/components/create-overlay/components/overlay-preview';
// import { SettingControl } from '@/renderer/components/create-overlay/components/setting-control';
// import { Button } from '@/renderer/components/ui/button';
// import { ScrollArea } from '@/renderer/components/ui/scroll-area';
// import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/renderer/components/ui/tabs';
// import type { OverlaySettingDescription } from '@/shared/types/OverlaySettingDescription';
// import type { SettingValue } from '@/shared/types/SettingValue';

interface OverlaySettingsPopupProps {
  overlay: LayoutOverlay | null;
  overlayManifest: OverlayManifestFile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (overlayId: string, settings: OverlaySettingInLayout[]) => void;
}

const OverlaySettingsPopup = ({
  overlay,
  isOpen,
  onClose,
  onSave,
  overlayManifest,
}: OverlaySettingsPopupProps) => {
  const [currentSettings, setCurrentSettings] = useState<OverlaySettingInLayout[]>([]);

  useEffect(() => {
    if (overlay) {
      setCurrentSettings(overlay.settings);
    }
  }, [overlay]);

  const handleSettingChange = (settingId: string, value: SettingValue) => {
    setCurrentSettings(prev => ({
      ...prev,
      [settingId]: value,
    }));
  };

  const handleSave = () => {
    if (overlay) {
      onSave(overlay.id, currentSettings);
      onClose();
    }
  };

  const handleCancel = () => {
    if (overlay) {
      setCurrentSettings(overlay.settings);
    }
    onClose();
  };

  const handleReset = () => {
    if (overlay) {
      setCurrentSettings(overlay.settings);
    }
  };

  //   const groupSettingsByGroup = (settings: OverlaySettingDescription[]) => {
  //     const grouped: Record<string, OverlaySettingDescription[]> = {};

  //     settings.forEach(setting => {
  //       const groupName = setting.group || 'Other Settings';
  //       if (!grouped[groupName]) {
  //         grouped[groupName] = [];
  //       }
  //       grouped[groupName].push(setting);
  //     });

  //     return grouped;
  //   };

  //   const buildIframeUrl = () => {
  //     if (!overlay) return '';

  //     const baseUrl = `http://localhost:42049/preview/${overlay.id}`;
  //     const params = new URLSearchParams();

  //     Object.entries(currentSettings).forEach(([key, value]) => {
  //       params.append(key, String(value));
  //     });

  //     return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  //   };

  //   if (!overlay) return null;

  //   const groupedSettings = groupSettingsByGroup(overlay.manifest.settings);
  //   const groupNames = Object.keys(groupedSettings);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={handleCancel}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className="bg-background flex max-h-[95vh] w-full max-w-6xl flex-col rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={onClose}>
              <X />
            </button>
            <div>Content</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OverlaySettingsPopup;
