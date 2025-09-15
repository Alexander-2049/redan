import { motion, AnimatePresence } from 'framer-motion';
// import { X, Save, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

import { ScrollArea } from '../../ui/scroll-area';

import { AcceptedValueTypes, SettingsInterface } from './settings-interface';

import { OverlayManifestFile } from '@/main/shared/schemas/overlay-manifest-file-schema';
import { LayoutOverlay } from '@/main/shared/types/LayoutOverlay';
import { OverlaySettingInLayout } from '@/main/shared/types/LayoutOverlaySetting';

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
  manifest: OverlayManifestFile | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (overlayId: string, settings: OverlaySettingInLayout[]) => void;
}

const OverlaySettingsPopup = ({
  overlay,
  manifest,
  isOpen,
  onClose,
  onSave,
}: OverlaySettingsPopupProps) => {
  const [currentSettings, setCurrentSettings] = useState<OverlaySettingInLayout[]>([]);
  const [settingValues, setSettingValues] = useState<Record<string, AcceptedValueTypes>>({});

  const [lastOverlay, setLastOverlay] = useState<null | LayoutOverlay>(null);
  const [lastManifest, setLastManifest] = useState<null | OverlayManifestFile>(null);

  useEffect(() => {
    if (overlay !== null) {
      setLastOverlay(overlay);
    }
  }, [overlay]);

  useEffect(() => {
    if (overlay) {
      console.log(overlay.settings);
      setSettingValues(
        overlay.settings.reduce((acc, setting) => ({ ...acc, [setting.id]: setting.value }), {}),
      );
    }
  }, [overlay]);

  useEffect(() => {
    const newSettings: OverlaySettingInLayout[] = Object.entries(settingValues).map(
      ([id, value]) => ({
        id,
        value,
      }),
    );
    setCurrentSettings(newSettings);
  }, [settingValues]);

  useEffect(() => {
    if (manifest !== null) {
      setLastManifest(manifest);
    }
  }, [overlay]);

  const handleSave = () => {
    if (overlay) {
      onSave(overlay.id, currentSettings);
      onClose();
    }
  };

  const handleCancel = () => {
    if (overlay) {
      setCurrentSettings([]);
    }
    onClose();
  };

  if (!lastOverlay || !lastManifest) return;

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
            className="bg-background flex h-[80vh] w-full max-w-6xl flex-col rounded-lg shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            <ScrollArea>
              <SettingsInterface
                manifest={lastManifest}
                setSettingValues={setSettingValues}
                settingValues={settingValues}
                overlay={lastOverlay}
              />
            </ScrollArea>
            <button onClick={handleSave}>Save</button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OverlaySettingsPopup;
