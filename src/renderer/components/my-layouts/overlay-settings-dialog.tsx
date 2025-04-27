import type { ILayoutOverlay } from "@/main/services/layoutService/schemas/overlaySchema";
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
import { Separator } from "../ui/separator";

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
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Overlay Settings</DialogTitle>
          <DialogDescription>
            Customize the settings for this overlay.
          </DialogDescription>
        </DialogHeader>
        <div className="custom-scrollbar max-h-[60vh] overflow-y-auto py-4 pr-2">
          <div className="mb-6 space-y-2">
            <label htmlFor="overlay-name" className="text-sm font-medium">
              Overlay Name
            </label>
            <Input
              id="overlay-name"
              type="text"
              value={selectedOverlay.layoutOverlay.name}
              onChange={(e) => {
                const newName = e.target.value;
                onOverlayChange({
                  ...selectedOverlay,
                  layoutOverlay: {
                    ...selectedOverlay.layoutOverlay,
                    name: newName,
                  },
                });
              }}
              className="w-full"
            />
            {selectedOverlay.manifestOverlay.data.description && (
              <p className="text-muted-foreground text-sm">
                {selectedOverlay.manifestOverlay.data.description}
              </p>
            )}
          </div>

          <Separator className="my-6" />

          {selectedOverlay.manifestOverlay.data.settings?.length ? (
            <div className="space-y-6">
              <h3 className="text-sm font-medium">Settings</h3>
              <div className="space-y-5">
                {selectedOverlay.manifestOverlay.data.settings.map(
                  (setting) => {
                    const currentValue =
                      selectedOverlay.layoutOverlay.settings.find(
                        (s) => s.id === setting.id,
                      )?.value ?? setting.defaultValue;

                    return (
                      <div key={setting.id} className="grid gap-2">
                        <label
                          htmlFor={setting.id}
                          className="flex items-center justify-between text-sm font-medium"
                        >
                          <span>{setting.name}</span>
                          {setting.type === "slider" &&
                            typeof currentValue === "number" && (
                              <span className="text-muted-foreground text-xs font-normal">
                                {currentValue}
                                {setting.unit === "percentage" ? "%" : ""}
                              </span>
                            )}
                        </label>

                        {setting.type === "slider" &&
                          typeof currentValue === "number" && (
                            <div className="flex items-center gap-2">
                              <div className="relative w-full">
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
                                  className="accent-primary h-2 w-full"
                                />
                              </div>
                            </div>
                          )}

                        {setting.type === "toggle" &&
                          typeof currentValue === "boolean" && (
                            <div className="flex items-center space-x-2">
                              <div
                                className="focus-visible:ring-ring focus-visible:ring-offset-background data-[state=checked]:bg-primary data-[state=unchecked]:bg-input relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                                data-state={
                                  currentValue ? "checked" : "unchecked"
                                }
                                onClick={() => {
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
                                                  value: !currentValue,
                                                }
                                              : s,
                                        ),
                                    },
                                  });
                                }}
                              >
                                <span
                                  className="bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
                                  data-state={
                                    currentValue ? "checked" : "unchecked"
                                  }
                                />
                              </div>
                              <label
                                htmlFor={setting.id}
                                className="text-muted-foreground text-sm"
                              >
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
                              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                              max={setting.max ?? Number.POSITIVE_INFINITY}
                              onChange={(e) => {
                                let newValue = Number.parseFloat(
                                  e.target.value,
                                );
                                const min = setting.min ?? 0;
                                const max =
                                  setting.max ?? Number.POSITIVE_INFINITY;
                                newValue = Math.max(
                                  min,
                                  Math.min(max, newValue),
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
                  },
                )}
              </div>
            </div>
          ) : (
            <div className="text-muted-foreground flex h-24 items-center justify-center rounded-md border border-dashed text-sm">
              This overlay has no configurable settings.
            </div>
          )}
        </div>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
