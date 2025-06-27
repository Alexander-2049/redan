/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "@/renderer/components/ui/button";
import { Label } from "@/renderer/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";
import { Badge } from "@/renderer/components/ui/badge";
import { Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { ConfiguratorSchemaViewer } from "./configurator-schema-viewer";
import { OverlayManifest } from "@/main/services/overlay-service/types";
import { MappedGameData } from "@/main/services/game-data/types/game-data-schema";
import { GameName } from "@/main/services/game-data/types/game-name-schema";

interface GameFieldsProps {
  manifestData: OverlayManifest;
  setManifestData: (
    data: OverlayManifest | ((prev: OverlayManifest) => OverlayManifest),
  ) => void;
  selectedGameSchema: MappedGameData | null;
  selectedGame: GameName;
  setSelectedGame: React.Dispatch<React.SetStateAction<GameName>>;
  games: GameName[];
}

export const ConfiguratorGameFields: React.FC<GameFieldsProps> = ({
  manifestData,
  setManifestData,
  selectedGameSchema,
  selectedGame,
  setSelectedGame,
  games,
}) => {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const addFieldToList = (field: string, listType: "required" | "optional") => {
    const listKey =
      listType === "required" ? "requiredFields" : "optionalFields";
    const currentList = manifestData[listKey];
    const otherListKey =
      listType === "required" ? "optionalFields" : "requiredFields";
    const otherList = manifestData[otherListKey];

    // Remove from other list if it exists there
    const updatedOtherList = otherList.filter((f) => f !== field);

    // Add to target list if not already there
    if (!currentList.includes(field)) {
      setManifestData((prev) => ({
        ...prev,
        [listKey]: [...currentList, field],
        [otherListKey]: updatedOtherList,
      }));
    }
  };

  const removeFieldFromList = (
    field: string,
    listType: "required" | "optional",
  ) => {
    const listKey =
      listType === "required" ? "requiredFields" : "optionalFields";
    setManifestData((prev) => ({
      ...prev,
      [listKey]: prev[listKey].filter((f) => f !== field),
    }));
  };

  const removeFieldFromAnyList = (field: string) => {
    setManifestData((prev) => ({
      ...prev,
      requiredFields: prev.requiredFields.filter((f) => f !== field),
      optionalFields: prev.optionalFields.filter((f) => f !== field),
    }));
  };

  const moveFieldBetweenLists = (
    field: string,
    fromList: "required" | "optional",
  ) => {
    const toList = fromList === "required" ? "optional" : "required";
    removeFieldFromList(field, fromList);
    addFieldToList(field, toList);
  };

  const copyFieldToClipboard = (field: string) => {
    navigator.clipboard.writeText(field);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1000);
  };

  const isFieldInAnyList = (field: string) => {
    return (
      manifestData.requiredFields.includes(field) ||
      manifestData.optionalFields.includes(field)
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Game Selection</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="game">Select Game for Field Reference</Label>
            <Select
              value={selectedGame}
              onValueChange={(value: GameName) => setSelectedGame(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a game" />
              </SelectTrigger>
              <SelectContent>
                {games.map((game) => {
                  return (
                    <SelectItem
                      key={`game-fields-selected-${game}`}
                      value={game}
                    >
                      {game}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Available Fields - {selectedGame}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedGameSchema && (
              <ConfiguratorSchemaViewer
                schema={selectedGameSchema}
                onFieldClick={copyFieldToClipboard}
                onAddRequired={(field) => addFieldToList(field, "required")}
                onAddOptional={(field) => addFieldToList(field, "optional")}
                onRemoveField={removeFieldFromAnyList}
                copiedField={copiedField}
                isFieldInAnyList={isFieldInAnyList}
              />
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Required Fields
                <Badge variant="destructive">
                  {manifestData.requiredFields.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {manifestData.requiredFields.map((field) => (
                <div
                  key={field}
                  className="bg-muted flex items-center justify-between rounded p-2"
                >
                  <span className="min-w-0 flex-1 truncate font-mono text-sm">
                    {field}
                  </span>
                  <div className="flex flex-shrink-0 gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveFieldBetweenLists(field, "required")}
                      title="Move to Optional Fields"
                    >
                      <ArrowDown className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFieldFromList(field, "required")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Optional Fields
                <Badge variant="secondary">
                  {manifestData.optionalFields.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {manifestData.optionalFields.map((field) => (
                <div
                  key={field}
                  className="bg-muted flex items-center justify-between rounded p-2"
                >
                  <span className="min-w-0 flex-1 truncate font-mono text-sm">
                    {field}
                  </span>
                  <div className="flex flex-shrink-0 gap-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => moveFieldBetweenLists(field, "optional")}
                      title="Move to Required Fields"
                    >
                      <ArrowUp className="h-4 w-4 text-red-600" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFieldFromList(field, "optional")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
