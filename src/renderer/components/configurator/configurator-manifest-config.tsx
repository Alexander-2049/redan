/* eslint-disable @typescript-eslint/no-explicit-any */
import type React from "react";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import { Checkbox } from "@/renderer/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import { OverlayManifest } from "@/main/services/overlay-service/types";

interface OptionalField {
  key: keyof OverlayManifest;
  label: string;
  type: "string" | "number" | "date";
  defaultValue?: any;
}

const optionalFields: OptionalField[] = [
  { key: "name", label: "Name", type: "string" },
  { key: "description", label: "Description", type: "string" },
  { key: "type", label: "Type", type: "string" },
  { key: "author", label: "Author", type: "string" },
  { key: "version", label: "Version", type: "string" },
  {
    key: "defaultWidth",
    label: "Default Width",
    type: "number",
    defaultValue: 300,
  },
  {
    key: "defaultHeight",
    label: "Default Height",
    type: "number",
    defaultValue: 160,
  },
  { key: "minWidth", label: "Min Width", type: "number", defaultValue: 100 },
  { key: "minHeight", label: "Min Height", type: "number", defaultValue: 50 },
  { key: "maxWidth", label: "Max Width", type: "number", defaultValue: 1000 },
  { key: "maxHeight", label: "Max Height", type: "number", defaultValue: 700 },
  { key: "publishDate", label: "Publish Date", type: "date" },
];

interface ManifestConfigProps {
  manifestData: OverlayManifest;
  setManifestData: (
    data: OverlayManifest | ((prev: OverlayManifest) => OverlayManifest),
  ) => void;
  enabledFields: Set<string>;
  setEnabledFields: (fields: Set<string>) => void;
}

export const ConfiguratorManifestConfig: React.FC<ManifestConfigProps> = ({
  manifestData,
  setManifestData,
  enabledFields,
  setEnabledFields,
}) => {
  const handleFieldToggle = (fieldKey: string, enabled: boolean) => {
    const newEnabledFields = new Set(enabledFields);
    if (enabled) {
      newEnabledFields.add(fieldKey);
    } else {
      newEnabledFields.delete(fieldKey);
    }
    setEnabledFields(newEnabledFields);
  };

  const handleManifestFieldChange = (
    key: keyof OverlayManifest,
    value: any,
  ) => {
    setManifestData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Manifest Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {optionalFields.map((field) => (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={field.key}
                checked={enabledFields.has(field.key)}
                onCheckedChange={(checked) =>
                  handleFieldToggle(field.key, checked as boolean)
                }
              />
              <Label htmlFor={field.key}>{field.label}</Label>
            </div>
            {enabledFields.has(field.key) && (
              <div className="ml-6">
                {field.type === "string" ? (
                  <Input
                    value={(manifestData[field.key] as string) || ""}
                    onChange={(e) =>
                      handleManifestFieldChange(field.key, e.target.value)
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : field.type === "number" ? (
                  <Input
                    type="number"
                    value={
                      (manifestData[field.key] as number) ||
                      field.defaultValue ||
                      ""
                    }
                    onChange={(e) =>
                      handleManifestFieldChange(
                        field.key,
                        Number.parseInt(e.target.value) || field.defaultValue,
                      )
                    }
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : field.type === "date" ? (
                  <Input
                    type="date"
                    value={
                      manifestData[field.key]
                        ? new Date(manifestData[field.key] as number)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      handleManifestFieldChange(
                        field.key,
                        new Date(e.target.value).getTime(),
                      )
                    }
                  />
                ) : null}
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
