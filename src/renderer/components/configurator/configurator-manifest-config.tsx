/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { Input } from "@/renderer/components/ui/input";
import { Label } from "@/renderer/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import { OverlayManifest } from "@/main/services/overlay-service/types";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { X } from "lucide-react";
import { ConfiguratorNestedBoxes } from "./configurator-nested-boxes";
import { Badge } from "../ui/badge";

interface ManifestConfigProps {
  manifestData: OverlayManifest;
  setManifestData: (
    data: OverlayManifest | ((prev: OverlayManifest) => OverlayManifest),
  ) => void;
}

export const ConfiguratorManifestConfig: React.FC<ManifestConfigProps> = ({
  manifestData,
  setManifestData,
}) => {
  const [newTag, setNewTag] = React.useState("");

  const handleManifestFieldChange = (
    key: keyof OverlayManifest,
    value: any,
  ) => {
    setManifestData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !manifestData.tags.includes(newTag.trim())) {
      handleManifestFieldChange("tags", [...manifestData.tags, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleManifestFieldChange(
      "tags",
      manifestData.tags.filter((tag) => tag !== tagToRemove),
    );
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={manifestData.title || ""}
              onChange={(e) =>
                handleManifestFieldChange("title", e.target.value)
              }
              placeholder="Enter overlay title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={manifestData.description || ""}
              onChange={(e) =>
                handleManifestFieldChange("description", e.target.value)
              }
              placeholder="Enter overlay description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags">Tags *</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Add a tag"
              />
              <Button onClick={addTag} type="button">
                Add
              </Button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {manifestData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <ConfiguratorNestedBoxes
        minWidth={manifestData.minWidth}
        minHeight={manifestData.minHeight}
        defaultWidth={manifestData.defaultWidth}
        defaultHeight={manifestData.defaultHeight}
        maxWidth={manifestData.maxWidth}
        maxHeight={manifestData.maxHeight}
        onMinWidthChange={(value) =>
          handleManifestFieldChange("minWidth", value)
        }
        onMinHeightChange={(value) =>
          handleManifestFieldChange("minHeight", value)
        }
        onDefaultWidthChange={(value) =>
          handleManifestFieldChange("defaultWidth", value)
        }
        onDefaultHeightChange={(value) =>
          handleManifestFieldChange("defaultHeight", value)
        }
        onMaxWidthChange={(value) =>
          handleManifestFieldChange("maxWidth", value)
        }
        onMaxHeightChange={(value) =>
          handleManifestFieldChange("maxHeight", value)
        }
      />
    </div>
  );
};
