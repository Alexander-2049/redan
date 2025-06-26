/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/renderer/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/renderer/components/ui/tabs";
import { Upload, Download, RotateCcw } from "lucide-react";
import { ConfiguratorBasicSetup } from "@/renderer/components/configurator/configurator-basic-setup";
import { ConfiguratorManifestConfig } from "@/renderer/components/configurator/configurator-manifest-config";
import { ConfiguratorSettings } from "@/renderer/components/configurator/configurator-settings";
import { ConfiguratorGameFields } from "@/renderer/components/configurator/configurator-game-fields";
import { ConfiguratorGeneratedCode } from "@/renderer/components/configurator/configurator-generated-code";
import { OverlayManifest } from "@/main/services/overlay-service/types";
import { ScrollArea } from "@radix-ui/react-scroll-area";

const MANIFEST_COOKIE_KEY = "overlay-manifest-data";

const ConfiguratorRoute = () => {
  const [devServerUrl, setDevServerUrl] = useState("http://localhost:3000");
  const [overlayState, setOverlayState] = useState<"closed" | "open" | "edit">(
    "closed",
  );
  const [manifestData, setManifestData] = useState<OverlayManifest>({
    defaultWidth: 800,
    defaultHeight: 600,
    minWidth: 100,
    minHeight: 100,
    maxWidth: 1000,
    maxHeight: 1000,
    requiredFields: [],
    optionalFields: [],
    settings: [],
  });
  const [enabledFields, setEnabledFields] = useState<Set<string>>(new Set());
  const [settingsValues, setSettingsValues] = useState<Record<string, any>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load manifest from cookies on component mount
  useEffect(() => {
    const savedManifest = getCookie(MANIFEST_COOKIE_KEY);
    if (savedManifest) {
      try {
        const parsed = JSON.parse(savedManifest);
        setManifestData(parsed);

        // Update enabled fields
        const newEnabledFields = new Set<string>();
        const optionalFieldKeys = [
          "name",
          "description",
          "type",
          "author",
          "version",
          "defaultWidth",
          "defaultHeight",
          "minWidth",
          "minHeight",
          "maxWidth",
          "maxHeight",
          "publishDate",
        ];
        optionalFieldKeys.forEach((fieldKey) => {
          if (parsed[fieldKey] !== undefined) {
            newEnabledFields.add(fieldKey);
          }
        });
        setEnabledFields(newEnabledFields);

        // Initialize settings values with defaults
        if (parsed.settings && Array.isArray(parsed.settings)) {
          const defaultValues: Record<string, any> = {};
          parsed.settings.forEach((setting: any) => {
            defaultValues[setting.id] = setting.defaultValue;
          });
          setSettingsValues(defaultValues);
        }
      } catch (error) {
        console.error("Failed to parse saved manifest:", error);
      }
    }
  }, []);

  // Save manifest to cookies whenever it changes
  useEffect(() => {
    setCookie(MANIFEST_COOKIE_KEY, JSON.stringify(manifestData), 30); // 30 days
  }, [manifestData]);

  // Update settings values when settings change
  useEffect(() => {
    if (manifestData.settings && Array.isArray(manifestData.settings)) {
      const defaultValues: Record<string, any> = {};
      manifestData.settings.forEach((setting: any) => {
        defaultValues[setting.id] =
          settingsValues[setting.id] ?? setting.defaultValue;
      });
      setSettingsValues(defaultValues);
    }
  }, [manifestData.settings]);

  const getCookie = (name: string): string | null => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
    return null;
  };

  const setCookie = (name: string, value: string, days: number) => {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
  };

  const deleteCookie = (name: string) => {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
  };

  // Handler functions for electron integration
  const handleOpenOverlay = () => {
    // This will be called by electron
    setOverlayState("open");
  };

  const handleCloseOverlay = () => {
    // This will be called by electron
    setOverlayState("closed");
  };

  const handleToggleEditMode = () => {
    // This will be called by electron
    setOverlayState((prev) => (prev === "edit" ? "open" : "edit"));
  };

  const downloadManifest = () => {
    const manifest: any = {
      requiredFields: manifestData.requiredFields,
      optionalFields: manifestData.optionalFields,
    };

    // Add enabled optional fields
    const optionalFieldKeys = [
      "name",
      "description",
      "type",
      "author",
      "version",
      "defaultWidth",
      "defaultHeight",
      "minWidth",
      "minHeight",
      "maxWidth",
      "maxHeight",
      "publishDate",
    ];

    optionalFieldKeys.forEach((fieldKey) => {
      if (enabledFields.has(fieldKey)) {
        const value = manifestData[fieldKey as keyof OverlayManifest];
        if (value !== undefined && value !== "") {
          manifest[fieldKey] = value;
        }
      }
    });

    // Add settings if they exist
    if (
      manifestData.settings &&
      Array.isArray(manifestData.settings) &&
      manifestData.settings.length > 0
    ) {
      manifest.settings = manifestData.settings;
    }

    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "manifest.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importManifest = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target?.result as string);
          setManifestData({
            ...imported,
            requiredFields: imported.requiredFields || [],
            optionalFields: imported.optionalFields || [],
            settings: Array.isArray(imported.settings) ? imported.settings : [], // Ensure array
          });

          // Update enabled fields
          const newEnabledFields = new Set<string>();
          const optionalFieldKeys = [
            "name",
            "description",
            "type",
            "author",
            "version",
            "defaultWidth",
            "defaultHeight",
            "minWidth",
            "minHeight",
            "maxWidth",
            "maxHeight",
            "publishDate",
          ];
          optionalFieldKeys.forEach((fieldKey) => {
            if (imported[fieldKey] !== undefined) {
              newEnabledFields.add(fieldKey);
            }
          });
          setEnabledFields(newEnabledFields);
        } catch (error) {
          alert("Invalid JSON file");
        }
      };
      reader.readAsText(file);
    }
  };

  const resetAll = () => {
    if (
      confirm(
        "Are you sure you want to reset all data? This will clear all your configuration.",
      )
    ) {
      deleteCookie(MANIFEST_COOKIE_KEY);
      setManifestData({
        defaultWidth: 800,
        defaultHeight: 600,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 1000,
        maxHeight: 1000,
        requiredFields: [],
        optionalFields: [],
        settings: [],
      });
      setEnabledFields(new Set());
      setSettingsValues({});
      setOverlayState("closed");
    }
  };

  const buildOverlayUrl = () => {
    const params = new URLSearchParams();
    Object.entries(settingsValues).forEach(([key, value]) => {
      params.append(key, String(value));
    });
    return `${devServerUrl}${params.toString() ? "?" + params.toString() : ""}`;
  };

  return (
    <>
      <ScrollArea className="h-full overflow-auto">
        <div className="container mx-auto max-w-6xl p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Overlay Configurator</h1>
              <p className="text-muted-foreground">
                Configure overlays for sim-racing games loaded from Steam
                Workshop
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={resetAll}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All
              </Button>
              <Button variant="outline" onClick={importManifest}>
                <Upload className="mr-2 h-4 w-4" />
                Import Manifest
              </Button>
              <Button onClick={downloadManifest}>
                <Download className="mr-2 h-4 w-4" />
                Download Manifest
              </Button>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileImport}
            style={{ display: "none" }}
          />

          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basic">Basic Setup</TabsTrigger>
              <TabsTrigger value="manifest">Manifest Config</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="fields">Game Fields</TabsTrigger>
              <TabsTrigger value="output">Generated Code</TabsTrigger>
            </TabsList>

            <TabsContent value="basic">
              <ConfiguratorBasicSetup
                devServerUrl={devServerUrl}
                setDevServerUrl={setDevServerUrl}
                overlayState={overlayState}
                onOpenOverlay={handleOpenOverlay}
                onCloseOverlay={handleCloseOverlay}
                onToggleEditMode={handleToggleEditMode}
                settings={manifestData.settings || []}
                settingsValues={settingsValues}
                setSettingsValues={setSettingsValues}
                overlayUrl={buildOverlayUrl()}
              />
            </TabsContent>

            <TabsContent value="manifest">
              <ConfiguratorManifestConfig
                manifestData={manifestData}
                setManifestData={setManifestData}
                enabledFields={enabledFields}
                setEnabledFields={setEnabledFields}
              />
            </TabsContent>

            <TabsContent value="settings">
              <ConfiguratorSettings
                settings={manifestData.settings || []}
                onSettingsChange={(settings) =>
                  setManifestData((prev) => ({ ...prev, settings }))
                }
                disabled={overlayState !== "closed"}
              />
            </TabsContent>

            <TabsContent value="fields">
              <ConfiguratorGameFields
                manifestData={manifestData}
                setManifestData={setManifestData}
              />
            </TabsContent>

            <TabsContent value="output">
              <ConfiguratorGeneratedCode
                manifestData={manifestData}
                enabledFields={enabledFields}
              />
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </>
  );
};

export default ConfiguratorRoute;
