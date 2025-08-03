import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, RotateCcw } from 'lucide-react';
import { useState, useEffect } from 'react';

import OverlayPreview from '@/renderer/components/create-overlay/components/overlay-preview';
import { SettingControl } from '@/renderer/components/create-overlay/components/setting-control';
import { Button } from '@/renderer/components/ui/button';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/renderer/components/ui/tabs';
import type { OverlaySettingDescription } from '@/shared/types/OverlaySettingDescription';
import type { SettingValue, SettingsMap } from '@/shared/types/SettingValue';

interface LayoutOverlay {
  id: string;
  overlayId: string;
  title: string;
  author: string;
  enabled: boolean;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  settings: SettingsMap;
  manifest: {
    dimentions: {
      defaultWidth: number;
      defaultHeight: number;
    };
    settings: OverlaySettingDescription[];
  };
}

interface OverlaySettingsPopupProps {
  overlay: LayoutOverlay | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (overlayId: string, settings: SettingsMap) => void;
}

const OverlaySettingsPopup = ({ overlay, isOpen, onClose, onSave }: OverlaySettingsPopupProps) => {
  const [currentSettings, setCurrentSettings] = useState<SettingsMap>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (overlay) {
      setCurrentSettings(overlay.settings);
      setHasChanges(false);
    }
  }, [overlay]);

  const handleSettingChange = (settingId: string, value: SettingValue) => {
    setCurrentSettings(prev => ({
      ...prev,
      [settingId]: value,
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (overlay) {
      onSave(overlay.id, currentSettings);
      setHasChanges(false);
      onClose();
    }
  };

  const handleCancel = () => {
    if (overlay) {
      setCurrentSettings(overlay.settings);
      setHasChanges(false);
    }
    onClose();
  };

  const handleReset = () => {
    if (overlay) {
      setCurrentSettings(overlay.settings);
      setHasChanges(false);
    }
  };

  const groupSettingsByGroup = (settings: OverlaySettingDescription[]) => {
    const grouped: Record<string, OverlaySettingDescription[]> = {};

    settings.forEach(setting => {
      const groupName = setting.group || 'Other Settings';
      if (!grouped[groupName]) {
        grouped[groupName] = [];
      }
      grouped[groupName].push(setting);
    });

    return grouped;
  };

  const buildIframeUrl = () => {
    if (!overlay) return '';

    const baseUrl = `http://localhost:42049/preview/${overlay.overlayId}`;
    const params = new URLSearchParams();

    Object.entries(currentSettings).forEach(([key, value]) => {
      params.append(key, String(value));
    });

    return params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;
  };

  if (!overlay) return null;

  const groupedSettings = groupSettingsByGroup(overlay.manifest.settings);
  const groupNames = Object.keys(groupedSettings);

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
            {/* Header */}
            <div className="flex items-center justify-between border-b p-6">
              <div>
                <h2 className="text-xl font-bold">{overlay.title}</h2>
                <p className="text-muted-foreground text-sm">by {overlay.author}</p>
              </div>
              <div className="flex items-center gap-2">
                {hasChanges && (
                  <Button variant="outline" size="sm" onClick={handleReset}>
                    <RotateCcw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                )}
                <Button variant="ghost" size="icon" onClick={handleCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content */}
            <div className="flex min-h-0 flex-1">
              {/* Preview Section */}
              <div className="w-1/2 border-r p-6">
                <h3 className="mb-4 font-semibold">Preview</h3>
                <OverlayPreview
                  defaultWidth={overlay.manifest.dimentions.defaultWidth}
                  defaultHeight={overlay.manifest.dimentions.defaultHeight}
                  parentHeight={400}
                  iframeUrl={buildIframeUrl()}
                  backgroundImageUrl="/placeholder.svg?height=400&width=600"
                />
              </div>

              {/* Settings Section */}
              <div className="flex min-h-0 w-1/2 flex-col">
                <div className="p-6 pb-4">
                  <h3 className="mb-4 font-semibold">Settings</h3>
                </div>

                <ScrollArea className="flex-1">
                  <div className="px-6 pb-6">
                    {groupNames.length > 1 ? (
                      <Tabs defaultValue={groupNames[0]} className="w-full">
                        <TabsList
                          className="mb-4 grid w-full"
                          style={{ gridTemplateColumns: `repeat(${groupNames.length}, 1fr)` }}
                        >
                          {groupNames.map(groupName => (
                            <TabsTrigger key={groupName} value={groupName} className="text-xs">
                              {groupName}
                            </TabsTrigger>
                          ))}
                        </TabsList>

                        {groupNames.map(groupName => (
                          <TabsContent key={groupName} value={groupName} className="space-y-4">
                            {groupedSettings[groupName].map(setting => (
                              <SettingControl
                                key={setting.id}
                                setting={setting}
                                value={currentSettings[setting.id] ?? setting.defaultValue}
                                onChange={value => handleSettingChange(setting.id, value)}
                              />
                            ))}
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <div className="space-y-4">
                        {overlay.manifest.settings.map(setting => (
                          <SettingControl
                            key={setting.id}
                            setting={setting}
                            value={currentSettings[setting.id] ?? setting.defaultValue}
                            onChange={value => handleSettingChange(setting.id, value)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 border-t p-6">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={!hasChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OverlaySettingsPopup;
