/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { OverlayManifest } from "@/main/_/overlay-service/types";
import { MappedGameData } from "@/main/_/game-data/types/game-data-schema";
import { GameName } from "@/main/_/game-data/types/game-name-schema";
import { ScrollArea } from "../components/ui/scroll-area";

const MANIFEST_COOKIE_KEY = "overlay-manifest-data";
const DEFAULT_MANIFEST_DATA = {
  defaultWidth: 200,
  defaultHeight: 200,
  minWidth: 100,
  minHeight: 100,
  maxWidth: 300,
  maxHeight: 300,
  requiredFields: [],
  optionalFields: [],
  settings: [],
  tags: [],
  title: "",
};
const GAMES: GameName[] = ["iRacing"];

const ConfiguratorRoute = () => {
  const [devServerUrl, setDevServerUrl] = useState("http://localhost:3000");
  const [overlayState, setOverlayState] = useState<"closed" | "open" | "edit">(
    "closed",
  );
  const [manifestData, setManifestData] = useState<OverlayManifest>(
    DEFAULT_MANIFEST_DATA,
  );
  const [settingsValues, setSettingsValues] = useState<Record<string, any>>({});

  const [schemas, setSchemas] = useState<[GameName, MappedGameData][]>([]);
  const [selectedGameSchema, setSelectedGameSchema] =
    useState<MappedGameData | null>(null);
  const [selectedGame, setSelectedGame] = useState<GameName>(GAMES[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    GAMES.forEach((game) => {
      window.electron.getGameDataShape(game).then((e) => {
        if (e === null) return;
        setSchemas((prev) => {
          return [...prev, [game, e]];
        });
      });
    });
  }, []);

  useEffect(() => {
    const rec = schemas.find((e) => e[0] === selectedGame);
    if (rec) setSelectedGameSchema(rec[1]);
  }, [selectedGame, schemas]);

  // Load manifest from cookies on component mount
  useEffect(() => {
    const savedManifest = getCookie(MANIFEST_COOKIE_KEY);
    if (savedManifest) {
      try {
        const parsed = JSON.parse(savedManifest);
        setManifestData(parsed);

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
    if (manifestData === DEFAULT_MANIFEST_DATA) return;
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
    const blob = new Blob([JSON.stringify(manifestData, null, 2)], {
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
      setManifestData(DEFAULT_MANIFEST_DATA);
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
      <ScrollArea className="h-full">
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
                selectedGame={selectedGame}
                selectedGameSchema={selectedGameSchema}
                setSelectedGame={setSelectedGame}
                games={GAMES}
              />
            </TabsContent>

            <TabsContent value="output">
              {schemas && (
                <ConfiguratorGeneratedCode
                  manifestData={manifestData}
                  schemas={schemas}
                />
              )}
            </TabsContent>
          </Tabs>
        </div>
      </ScrollArea>
    </>
  );
};

export default ConfiguratorRoute;
