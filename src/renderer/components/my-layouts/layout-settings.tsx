import type React from 'react';

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Trash2 } from 'lucide-react';
import { Input } from '@/renderer/components/ui/input';
import { Textarea } from '@/renderer/components/ui/textarea';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/renderer/components/ui/accordion';
import { Card, CardContent } from '@/renderer/components/ui/card';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/renderer/components/ui/alert-dialog';
import { useLayouts } from '@/renderer/api/layouts/get-layouts';
import { useOverlays } from '@/renderer/api/overlays/get-overlays';
import { useModifyLayout } from '@/renderer/api/layouts/modify-layout';
import { Separator } from '@/renderer/components/ui/separator';
import type {
  ILayoutOverlay,
  ILayoutOverlaySetting,
  ILayoutOverlaySettingValue,
} from '@/main/_/layout-service/schemas/overlaySchema';
import type { OverlaySettingDescription } from '@/main/_/overlay-service/types';
import type { OverlayAndFolderName } from '@/shared/types/overlay-and-folder-name';

const LayoutSettings = () => {
  const { data: layouts, isLoading: isLoadingLayouts } = useLayouts();
  const { data: overlayManifests, isLoading: isLoadingOverlays } = useOverlays();
  const { mutate: modifyLayout } = useModifyLayout();

  const [layoutName, setLayoutName] = useState('');
  const [layoutDescription, setLayoutDescription] = useState('');
  const [activeLayoutOverlays, setActiveLayoutOverlays] = useState<ILayoutOverlay[]>([]);
  const [activeLayoutFileName, setActiveLayoutFileName] = useState<string>('');
  const [overlayToDelete, setOverlayToDelete] = useState<string | null>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [pendingUpdates, setPendingUpdates] = useState<Record<string, any>>({});

  useEffect(() => {
    if (layouts && layouts.length > 0) {
      const activeLayout = layouts.find(layout => layout.data.active);

      if (activeLayout) {
        setLayoutName(activeLayout.data.name || '');
        setLayoutDescription(activeLayout.data.description || '');
        setActiveLayoutOverlays(activeLayout.data.overlays || []);
        setActiveLayoutFileName(activeLayout.filename);
      } else {
        setActiveLayoutOverlays([]);
        setActiveLayoutFileName('');
      }
    } else {
      setActiveLayoutOverlays([]);
      setActiveLayoutFileName('');
    }
  }, [layouts]);

  if (isLoadingLayouts || isLoadingOverlays) {
    return <div className="flex h-full items-center justify-center">Loading...</div>;
  }

  if (!layouts || layouts.length === 0 || !activeLayoutFileName) {
    return (
      <ScrollArea className="bg-background/95 flex h-full w-80 flex-col overflow-auto border-l">
        <div className="border-b p-4">
          <h2 className="mb-4 text-lg font-semibold">Layout Settings</h2>
          <div className="rounded-md bg-amber-50 p-4 text-amber-800">
            <h3 className="text-md font-medium">No Active Layout</h3>
            <p className="mt-2 text-sm">
              Please select a layout to configure its settings. You can create or select a layout
              from the layouts panel.
            </p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  const getOverlayManifest = (folderName: string): OverlayAndFolderName | undefined => {
    return overlayManifests?.find(manifest => manifest.folderName === folderName);
  };

  const updateLayoutField = (field: 'name' | 'description', value: string) => {
    if (field === 'name') {
      setLayoutName(value);
    } else {
      setLayoutDescription(value);
    }

    // Apply changes immediately
    const activeLayout = layouts.find(layout => layout.data.active);
    if (activeLayout) {
      modifyLayout({
        fileName: activeLayoutFileName,
        updatedData: {
          ...activeLayout.data,
          name: field === 'name' ? value : layoutName,
          description: field === 'description' ? value : layoutDescription,
          overlays: activeLayoutOverlays,
        },
      });
    }
  };

  const toggleVisibility = (id: string) => {
    const updatedOverlays = activeLayoutOverlays.map(overlay =>
      overlay.id === id ? { ...overlay, visible: !overlay.visible } : overlay,
    );
    setActiveLayoutOverlays(updatedOverlays);

    // Apply changes immediately
    const activeLayout = layouts.find(layout => layout.data.active);
    if (activeLayout) {
      modifyLayout({
        fileName: activeLayoutFileName,
        updatedData: {
          ...activeLayout.data,
          name: layoutName,
          description: layoutDescription,
          overlays: updatedOverlays,
        },
      });
    }
  };

  const updateOverlaySetting = (
    overlayId: string,
    settingId: string,
    value: ILayoutOverlaySettingValue,
  ) => {
    const updatedOverlays = activeLayoutOverlays.map(overlay => {
      if (overlay.id !== overlayId) return overlay;

      return {
        ...overlay,
        settings: overlay.settings.map(setting =>
          setting.id === settingId ? { ...setting, value } : setting,
        ),
      };
    });

    setActiveLayoutOverlays(updatedOverlays);

    // Apply changes immediately
    const activeLayout = layouts.find(layout => layout.data.active);
    if (activeLayout) {
      modifyLayout({
        fileName: activeLayoutFileName,
        updatedData: {
          ...activeLayout.data,
          name: layoutName,
          description: layoutDescription,
          overlays: updatedOverlays,
        },
      });
    }
  };

  const deleteOverlay = (id: string) => {
    // Filter out the overlay with the given id
    const updatedOverlays = activeLayoutOverlays.filter(overlay => overlay.id !== id);
    setActiveLayoutOverlays(updatedOverlays);

    // Apply changes immediately
    const activeLayout = layouts.find(layout => layout.data.active);
    if (activeLayout) {
      modifyLayout({
        fileName: activeLayoutFileName,
        updatedData: {
          ...activeLayout.data,
          name: layoutName,
          description: layoutDescription,
          overlays: updatedOverlays,
        },
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (overlayToDelete) {
      deleteOverlay(overlayToDelete);
      setOverlayToDelete(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Prevent triggering the AccordionTrigger

    if (e.shiftKey) {
      // Delete immediately if Shift key is pressed
      deleteOverlay(id);
    } else {
      // Otherwise show confirmation dialog
      setOverlayToDelete(id);
    }
  };

  const renderSettingControl = (
    overlay: ILayoutOverlay,
    setting: ILayoutOverlaySetting,
    settingDescription?: OverlaySettingDescription,
  ) => {
    if (!settingDescription) return null;

    const currentValue = setting.value;
    const sliderKey = `${overlay.id}-${setting.id}`;

    switch (settingDescription.type) {
      case 'slider':
        return (
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor={`overlay-${overlay.id}-setting-${setting.id}`}>
                {settingDescription.name}
              </Label>
              <span className="text-muted-foreground text-xs">
                {currentValue}
                {settingDescription.unit === 'percentage' ? '%' : ''}
              </span>
            </div>
            <Input
              id={`overlay-${overlay.id}-setting-${setting.id}`}
              type="range"
              min={settingDescription.min}
              max={settingDescription.max}
              step={settingDescription.step}
              value={
                typeof currentValue === 'number' ? currentValue : settingDescription.defaultValue
              }
              onChange={e => {
                const newValue = Number(e.target.value);
                // Update local state immediately for responsive UI
                const updatedOverlays = activeLayoutOverlays.map(o => {
                  if (o.id !== overlay.id) return o;
                  return {
                    ...o,
                    settings: o.settings.map(s =>
                      s.id === setting.id ? { ...s, value: newValue } : s,
                    ),
                  };
                });
                setActiveLayoutOverlays(updatedOverlays);

                // Store pending update
                setPendingUpdates(prev => ({
                  ...prev,
                  [sliderKey]: {
                    overlayId: overlay.id,
                    settingId: setting.id,
                    value: newValue,
                  },
                }));
              }}
              onMouseUp={() => {
                // Apply the pending update
                const pendingUpdate = pendingUpdates[sliderKey];
                if (pendingUpdate) {
                  updateOverlaySetting(
                    pendingUpdate.overlayId,
                    pendingUpdate.settingId,
                    pendingUpdate.value,
                  );
                  setPendingUpdates(prev => {
                    const newPending = { ...prev };
                    delete newPending[sliderKey];
                    return newPending;
                  });
                }
              }}
              className="accent-primary h-2 w-full"
            />
          </div>
        );

      case 'toggle':
        if (typeof currentValue !== 'boolean') return null;
        return (
          <div className="flex items-center space-x-2">
            <Switch
              id={`overlay-${overlay.id}-setting-${setting.id}`}
              checked={
                typeof currentValue === 'boolean' ? currentValue : settingDescription.defaultValue
              }
              onCheckedChange={checked => updateOverlaySetting(overlay.id, setting.id, checked)}
            />
            <Label htmlFor={`overlay-${overlay.id}-setting-${setting.id}`}>
              {settingDescription.name}
            </Label>
          </div>
        );

      case 'select':
        return (
          <div className="grid gap-2">
            <Label htmlFor={`overlay-${overlay.id}-setting-${setting.id}`}>
              {settingDescription.name}
            </Label>
            <select
              id={`overlay-${overlay.id}-setting-${setting.id}`}
              value={
                typeof currentValue === 'string' ? currentValue : settingDescription.defaultValue
              }
              onChange={e => updateOverlaySetting(overlay.id, setting.id, e.target.value)}
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {settingDescription.selectList.map(option => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))}
            </select>
          </div>
        );

      case 'number':
        return (
          <div className="grid gap-2">
            <Label htmlFor={`overlay-${overlay.id}-setting-${setting.id}`}>
              {settingDescription.name}
            </Label>
            <Input
              id={`overlay-${overlay.id}-setting-${setting.id}`}
              type="number"
              min={settingDescription.min}
              max={settingDescription.max}
              value={
                typeof currentValue === 'number' ? currentValue : settingDescription.defaultValue
              }
              onChange={e => {
                // Update local state immediately for responsive UI
                const newValue = Number(e.target.value);
                const updatedOverlays = activeLayoutOverlays.map(o => {
                  if (o.id !== overlay.id) return o;
                  return {
                    ...o,
                    settings: o.settings.map(s =>
                      s.id === setting.id ? { ...s, value: newValue } : s,
                    ),
                  };
                });
                setActiveLayoutOverlays(updatedOverlays);
              }}
              onBlur={e => {
                // Only call API on blur (when input becomes inactive)
                updateOverlaySetting(overlay.id, setting.id, Number(e.target.value));
              }}
            />
          </div>
        );

      case 'string':
        return (
          <div className="grid gap-2">
            <Label htmlFor={`overlay-${overlay.id}-setting-${setting.id}`}>
              {settingDescription.name}
            </Label>
            <Input
              id={`overlay-${overlay.id}-setting-${setting.id}`}
              type="text"
              value={
                typeof currentValue === 'string' ? currentValue : settingDescription.defaultValue
              }
              onChange={e => {
                // Update local state immediately for responsive UI
                const updatedOverlays = activeLayoutOverlays.map(o => {
                  if (o.id !== overlay.id) return o;
                  return {
                    ...o,
                    settings: o.settings.map(s =>
                      s.id === setting.id ? { ...s, value: e.target.value } : s,
                    ),
                  };
                });
                setActiveLayoutOverlays(updatedOverlays);
              }}
              onBlur={e => {
                // Only call API on blur (when input becomes inactive)
                updateOverlaySetting(overlay.id, setting.id, e.target.value);
              }}
            />
          </div>
        );

      case 'color':
        return (
          <div className="grid gap-2">
            <Label htmlFor={`overlay-${overlay.id}-setting-${setting.id}`}>
              {settingDescription.name}
            </Label>
            <Input
              id={`overlay-${overlay.id}-setting-${setting.id}`}
              type="color"
              value={
                typeof currentValue === 'string' ? currentValue : settingDescription.defaultValue
              }
              onChange={e => {
                // Update local state immediately for responsive UI
                const updatedOverlays = activeLayoutOverlays.map(o => {
                  if (o.id !== overlay.id) return o;
                  return {
                    ...o,
                    settings: o.settings.map(s =>
                      s.id === setting.id ? { ...s, value: e.target.value } : s,
                    ),
                  };
                });
                setActiveLayoutOverlays(updatedOverlays);
              }}
              onBlur={e => {
                // Only call API on blur (when input becomes inactive)
                updateOverlaySetting(overlay.id, setting.id, e.target.value);
              }}
              className="h-10 w-16 border-none bg-transparent p-0"
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Find the overlay name for the overlay being deleted
  const overlayBeingDeleted = activeLayoutOverlays.find(overlay => overlay.id === overlayToDelete);

  return (
    <ScrollArea className="bg-background/95 flex h-full w-80 flex-col overflow-auto border-l">
      <div className="border-b p-4">
        <h2 className="mb-4 text-lg font-semibold">Layout Settings</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="layout-name">Layout Name</Label>
            <Input
              id="layout-name"
              value={layoutName}
              onChange={e => setLayoutName(e.target.value)}
              onBlur={e => updateLayoutField('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="layout-description">Description</Label>
            <Textarea
              id="layout-description"
              value={layoutDescription}
              onChange={e => setLayoutDescription(e.target.value)}
              onBlur={e => updateLayoutField('description', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="border-b p-4">
        <h3 className="text-md mb-2 font-medium">Overlays</h3>
      </div>

      {activeLayoutOverlays.length === 0 ? (
        <div className="p-4">
          <div className="rounded-md bg-slate-50 p-4 text-slate-700">
            <h3 className="text-md font-medium">No Overlays Added</h3>
            <p className="mt-2 text-sm">
              You need to add overlays to this layout before you can configure them. Add overlays
              from the overlays panel.
            </p>
          </div>
        </div>
      ) : (
        <div className="p-4">
          <Accordion type="multiple" className="w-full">
            {activeLayoutOverlays.map(overlay => {
              const overlayManifest = getOverlayManifest(overlay.folderName);

              return (
                <AccordionItem key={overlay.id} value={`overlay-${overlay.id}`}>
                  <AccordionTrigger className="px-4 py-3 hover:no-underline">
                    <div className="flex w-full items-center justify-between pr-2">
                      <span>{overlay.name}</span>
                      <div className="flex items-center space-x-1">
                        <div
                          role="button"
                          tabIndex={0}
                          className="hover:bg-muted flex h-8 w-8 items-center justify-center rounded-full focus:outline-none"
                          onClick={e => {
                            e.stopPropagation(); // Prevent triggering the AccordionTrigger
                            toggleVisibility(overlay.id);
                          }}
                        >
                          {overlay.visible ? (
                            <Eye className="h-4 w-4" />
                          ) : (
                            <EyeOff className="text-muted-foreground h-4 w-4" />
                          )}
                        </div>
                        <div
                          role="button"
                          tabIndex={0}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-red-500 hover:bg-red-100 focus:outline-none"
                          onClick={e => {
                            handleDeleteClick(e, overlay.id);
                          }}
                          title="Delete overlay (Shift+Click to bypass confirmation)"
                        >
                          <Trash2 className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <Card className="border-0 shadow-none">
                      <CardContent className="p-3 pt-0">
                        <div className="space-y-4">
                          {/* Custom settings from manifest */}
                          {overlayManifest?.data.settings &&
                            overlayManifest.data.settings.length > 0 && (
                              <>
                                <Separator className="my-2" />
                                <h4 className="mb-3 text-sm font-medium">Settings</h4>
                                <div className="space-y-4">
                                  {overlay.settings.map(setting => {
                                    const settingDescription = overlayManifest.data.settings?.find(
                                      desc => desc.id === setting.id,
                                    );

                                    return (
                                      <div key={setting.id}>
                                        {renderSettingControl(overlay, setting, settingDescription)}
                                      </div>
                                    );
                                  })}
                                </div>
                              </>
                            )}
                        </div>
                      </CardContent>
                    </Card>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!overlayToDelete}
        onOpenChange={open => !open && setOverlayToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Overlay</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the overlay "{overlayBeingDeleted?.name}" from this
              layout? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollArea>
  );
};

export default LayoutSettings;
