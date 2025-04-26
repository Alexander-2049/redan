import { ILayoutOverlay } from "@/main/services/layoutService/schemas/overlaySchema";
import { Button } from "@/renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";

interface OverlaySettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedOverlay: {
    layoutFileName: string;
    layoutOverlay: ILayoutOverlay;
    manifestOverlay: IOverlayAndFolderName;
  } | null;
  onOverlayChange: (overlay: {
    layoutFileName: string;
    layoutOverlay: ILayoutOverlay;
    manifestOverlay: IOverlayAndFolderName;
  }) => void;
  onSave: () => void;
}

export function OverlaySettingsDialog({
  isOpen,
  onOpenChange,
  selectedOverlay,
  onOverlayChange,
  onSave,
}: OverlaySettingsDialogProps) {
  if (!selectedOverlay) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Overlay Settings</DialogTitle>
          <DialogDescription>
            Customize the settings for this overlay.
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto py-4">
          <div className="mb-4">
            <h3 className="font-medium">
              {selectedOverlay.manifestOverlay.data.name}
            </h3>
            {selectedOverlay.manifestOverlay.data.description && (
              <p className="text-muted-foreground mt-1 text-sm">
                {selectedOverlay.manifestOverlay.data.description}
              </p>
            )}
          </div>

          {selectedOverlay.manifestOverlay.data.settings?.length ? (
            <div className="space-y-4">
              {selectedOverlay.manifestOverlay.data.settings.map((setting) => {
                const currentValue =
                  selectedOverlay.layoutOverlay.settings.find(
                    (s) => s.id === setting.id,
                  )?.value ?? setting.defaultValue;

                return (
                  <div key={setting.id} className="grid gap-2">
                    <label htmlFor={setting.id} className="text-sm font-medium">
                      {setting.name}
                    </label>

                    {setting.type === "slider" &&
                      typeof currentValue === "number" && (
                        <div className="flex items-center gap-2">
                          <Input
                            id={setting.id}
                            type="range"
                            min={setting.min}
                            max={setting.max}
                            step={setting.step}
                            value={currentValue}
                            onChange={(e) => {
                              const newValue = Number.parseFloat(
                                e.target.value,
                              );
                              onOverlayChange({
                                ...selectedOverlay,
                                layoutOverlay: {
                                  ...selectedOverlay.layoutOverlay,
                                  settings:
                                    selectedOverlay.layoutOverlay.settings.map(
                                      (s) =>
                                        s.id === setting.id
                                          ? { ...s, value: newValue }
                                          : s,
                                    ),
                                },
                              });
                            }}
                            className="w-full"
                          />
                          <span className="w-12 text-right text-sm">
                            {currentValue}
                            {setting.unit === "percentage" ? "%" : ""}
                          </span>
                        </div>
                      )}

                    {setting.type === "toggle" &&
                      typeof currentValue === "boolean" && (
                        <div className="flex items-center space-x-2">
                          <input
                            id={setting.id}
                            type="checkbox"
                            checked={currentValue}
                            onChange={(e) => {
                              onOverlayChange({
                                ...selectedOverlay,
                                layoutOverlay: {
                                  ...selectedOverlay.layoutOverlay,
                                  settings:
                                    selectedOverlay.layoutOverlay.settings.map(
                                      (s) =>
                                        s.id === setting.id
                                          ? {
                                              ...s,
                                              value: e.target.checked,
                                            }
                                          : s,
                                    ),
                                },
                              });
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <label htmlFor={setting.id} className="text-sm">
                            {currentValue ? "Enabled" : "Disabled"}
                          </label>
                        </div>
                      )}

                    {setting.type === "select" &&
                      typeof currentValue === "string" && (
                        <select
                          id={setting.id}
                          value={currentValue}
                          onChange={(e) => {
                            onOverlayChange({
                              ...selectedOverlay,
                              layoutOverlay: {
                                ...selectedOverlay.layoutOverlay,
                                settings:
                                  selectedOverlay.layoutOverlay.settings.map(
                                    (s) =>
                                      s.id === setting.id
                                        ? {
                                            ...s,
                                            value: e.target.value,
                                          }
                                        : s,
                                  ),
                              },
                            });
                          }}
                          className="border-input bg-background w-full rounded-md border px-3 py-2 text-sm"
                        >
                          {setting.selectList.map((option) => (
                            <option key={option.id} value={option.id}>
                              {option.value}
                            </option>
                          ))}
                        </select>
                      )}

                    {setting.type === "number" &&
                      typeof currentValue === "number" && (
                        <Input
                          id={setting.id}
                          type="number"
                          value={currentValue}
                          min={setting.min ?? 0}
                          max={setting.max ?? Infinity}
                          onChange={(e) => {
                            let newValue = Number.parseFloat(e.target.value);
                            const min = setting.min ?? 0;
                            const max = setting.max ?? Infinity;
                            newValue = Math.max(min, Math.min(max, newValue));
                            onOverlayChange({
                              ...selectedOverlay,
                              layoutOverlay: {
                                ...selectedOverlay.layoutOverlay,
                                settings:
                                  selectedOverlay.layoutOverlay.settings.map(
                                    (s) =>
                                      s.id === setting.id
                                        ? { ...s, value: newValue }
                                        : s,
                                  ),
                              },
                            });
                          }}
                        />
                      )}

                    {setting.type === "string" &&
                      typeof currentValue === "string" && (
                        <Input
                          id={setting.id}
                          type="text"
                          value={currentValue}
                          onChange={(e) => {
                            onOverlayChange({
                              ...selectedOverlay,
                              layoutOverlay: {
                                ...selectedOverlay.layoutOverlay,
                                settings:
                                  selectedOverlay.layoutOverlay.settings.map(
                                    (s) =>
                                      s.id === setting.id
                                        ? {
                                            ...s,
                                            value: e.target.value,
                                          }
                                        : s,
                                  ),
                              },
                            });
                          }}
                        />
                      )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-muted-foreground py-4 text-center">
              This overlay has no configurable settings.
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
