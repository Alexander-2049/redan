"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/renderer/components/ui/input";
import { Textarea } from "@/renderer/components/ui/textarea";
import { Button } from "@/renderer/components/ui/button";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/renderer/components/ui/accordion";
import { Card, CardContent } from "@/renderer/components/ui/card";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";

const LayoutSettings = () => {
  const [overlays, setOverlays] = useState([
    { id: 1, name: "Webcam Overlay", visible: true },
    { id: 2, name: "Lower Third", visible: true },
    { id: 3, name: "Game Score", visible: false },
    { id: 4, name: "Social Media Bar", visible: true },
    { id: 5, name: "Alerts", visible: true },
  ]);

  const toggleVisibility = (id: number) => {
    setOverlays(
      overlays.map((overlay) =>
        overlay.id === id ? { ...overlay, visible: !overlay.visible } : overlay,
      ),
    );
  };

  return (
    <ScrollArea className="bg-background/95 flex h-full w-80 flex-col overflow-auto border-l">
      <div className="border-b p-4">
        <h2 className="mb-4 text-lg font-semibold">Layout Settings</h2>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="layout-name">Layout Name</Label>
            <Input id="layout-name" defaultValue="Stream Layout" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="layout-description">Description</Label>
            <Textarea
              id="layout-description"
              defaultValue="Main streaming layout with webcam and overlays"
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="border-b p-4">
        <h3 className="text-md mb-2 font-medium">Overlays</h3>
      </div>

      <div className="p-4">
        <Accordion type="multiple" className="w-full">
          {overlays.map((overlay) => (
            <AccordionItem key={overlay.id} value={`overlay-${overlay.id}`}>
              <AccordionTrigger className="px-4 py-3 hover:no-underline">
                <div className="flex w-full items-center justify-between pr-2">
                  <span>{overlay.name}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleVisibility(overlay.id);
                    }}
                  >
                    {overlay.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="text-muted-foreground h-4 w-4" />
                    )}
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <Card className="border-0 shadow-none">
                  <CardContent className="p-3 pt-0">
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor={`overlay-${overlay.id}-position-x`}>
                          Position X
                        </Label>
                        <Input
                          id={`overlay-${overlay.id}-position-x`}
                          defaultValue="100"
                          type="number"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`overlay-${overlay.id}-position-y`}>
                          Position Y
                        </Label>
                        <Input
                          id={`overlay-${overlay.id}-position-y`}
                          defaultValue="100"
                          type="number"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`overlay-${overlay.id}-width`}>
                          Width
                        </Label>
                        <Input
                          id={`overlay-${overlay.id}-width`}
                          defaultValue="400"
                          type="number"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor={`overlay-${overlay.id}-height`}>
                          Height
                        </Label>
                        <Input
                          id={`overlay-${overlay.id}-height`}
                          defaultValue="300"
                          type="number"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id={`overlay-${overlay.id}-lock-ratio`} />
                        <Label htmlFor={`overlay-${overlay.id}-lock-ratio`}>
                          Lock aspect ratio
                        </Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id={`overlay-${overlay.id}-snap-grid`} />
                        <Label htmlFor={`overlay-${overlay.id}-snap-grid`}>
                          Snap to grid
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default LayoutSettings;
