/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import { Badge } from "@/renderer/components/ui/badge";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { Slider } from "@/renderer/components/ui/slider";
import { Play, Square, Edit } from "lucide-react";

interface BasicSetupProps {
  devServerUrl: string;
  setDevServerUrl: (url: string) => void;
  overlayState: "closed" | "open" | "edit";
  onOpenOverlay: () => void;
  onCloseOverlay: () => void;
  onToggleEditMode: () => void;
  settings: any[];
  settingsValues: Record<string, any>;
  setSettingsValues: (
    values:
      | Record<string, any>
      | ((prev: Record<string, any>) => Record<string, any>),
  ) => void;
  overlayUrl: string;
}

export const ConfiguratorBasicSetup: React.FC<BasicSetupProps> = ({
  devServerUrl,
  setDevServerUrl,
  overlayState,
  onOpenOverlay,
  onCloseOverlay,
  onToggleEditMode,
  settings = [], // Add default empty array
  settingsValues,
  setSettingsValues,
  overlayUrl,
}) => {
  // Ensure settings is always an array
  const safeSettings = Array.isArray(settings) ? settings : [];

  const handleSettingChange = (settingId: string, value: any) => {
    setSettingsValues((prev) => ({
      ...prev,
      [settingId]: value,
    }));
  };

  const renderSettingControl = (setting: any) => {
    const value = settingsValues[setting.id] ?? setting.defaultValue;

    switch (setting.type) {
      case "slider":
        return (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>{setting.name}</Label>
              <span className="text-muted-foreground text-sm">
                {value}
                {setting.unit === "percentage" ? "%" : ""}
              </span>
            </div>
            <Slider
              value={[value]}
              onValueChange={([newValue]) =>
                handleSettingChange(setting.id, newValue)
              }
              min={setting.min}
              max={setting.max}
              step={setting.step}
              disabled={overlayState !== "closed"}
            />
          </div>
        );

      case "toggle":
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value}
              onCheckedChange={(checked) =>
                handleSettingChange(setting.id, checked)
              }
              disabled={overlayState !== "closed"}
            />
            <Label>{setting.name}</Label>
          </div>
        );

      case "select":
        return (
          <div className="space-y-2">
            <Label>{setting.name}</Label>
            <Select
              value={value}
              onValueChange={(newValue) =>
                handleSettingChange(setting.id, newValue)
              }
              disabled={overlayState !== "closed"}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {setting.selectList?.map((option: any) => (
                  <SelectItem key={option.id} value={option.id}>
                    {option.value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case "number":
        return (
          <div className="space-y-2">
            <Label>{setting.name}</Label>
            <Input
              type="number"
              value={value}
              onChange={(e) =>
                handleSettingChange(setting.id, Number(e.target.value))
              }
              min={setting.min}
              max={setting.max}
              disabled={overlayState !== "closed"}
            />
          </div>
        );

      case "string":
        return (
          <div className="space-y-2">
            <Label>{setting.name}</Label>
            <Input
              value={value}
              onChange={(e) => handleSettingChange(setting.id, e.target.value)}
              disabled={overlayState !== "closed"}
            />
          </div>
        );

      case "color":
        return (
          <div className="space-y-2">
            <Label>{setting.name}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={value}
                onChange={(e) =>
                  handleSettingChange(setting.id, e.target.value)
                }
                disabled={overlayState !== "closed"}
                className="h-10 w-16"
              />
              <Input
                value={value}
                onChange={(e) =>
                  handleSettingChange(setting.id, e.target.value)
                }
                disabled={overlayState !== "closed"}
                placeholder="#000000"
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Development Server</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="devUrl">Development Server URL</Label>
            <Input
              id="devUrl"
              value={devServerUrl}
              onChange={(e) => setDevServerUrl(e.target.value)}
              placeholder="http://localhost:3000"
              disabled={overlayState !== "closed"}
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={onOpenOverlay}
              disabled={overlayState === "open" || overlayState === "edit"}
              variant={
                overlayState === "open" || overlayState === "edit"
                  ? "default"
                  : "outline"
              }
            >
              <Play className="mr-2 h-4 w-4" />
              Open Overlay
            </Button>
            <Button
              onClick={onCloseOverlay}
              disabled={overlayState === "closed"}
              variant="outline"
            >
              <Square className="mr-2 h-4 w-4" />
              Close Overlay
            </Button>
            <Button
              onClick={onToggleEditMode}
              disabled={overlayState === "closed"}
              variant={overlayState === "edit" ? "default" : "outline"}
            >
              <Edit className="mr-2 h-4 w-4" />
              {overlayState === "edit" ? "Exit Edit" : "Edit Mode"}
            </Button>
          </div>
          <div className="text-muted-foreground text-sm">
            Status:{" "}
            <Badge
              variant={
                overlayState === "open"
                  ? "default"
                  : overlayState === "edit"
                    ? "secondary"
                    : "outline"
              }
            >
              {overlayState.charAt(0).toUpperCase() + overlayState.slice(1)}
            </Badge>
          </div>
          {overlayState !== "closed" && (
            <div className="text-muted-foreground text-sm">
              <Label>Current URL:</Label>
              <div className="bg-muted rounded p-2 font-mono text-xs break-all">
                {overlayUrl}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {safeSettings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Settings Preview</CardTitle>
            <p className="text-muted-foreground text-sm">
              Adjust settings for testing. Settings are only editable when
              overlay is closed.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            {safeSettings.map((setting) => (
              <div key={setting.id} className="rounded border p-3">
                {setting.group && (
                  <Badge variant="outline" className="mb-2">
                    {setting.group}
                  </Badge>
                )}
                {renderSettingControl(setting)}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
