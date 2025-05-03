"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/renderer/components/ui/accordion";
import { Badge } from "@/renderer/components/ui/badge";
import { Button } from "@/renderer/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import type { ILayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import { Edit, Layers, MoreVertical, Settings, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { ILayoutOverlay } from "@/main/services/layoutService/schemas/overlaySchema";
import { RemoveOverlayButton } from "@/renderer/components/my-layouts/remove-overlay-button";

interface LayoutCardProps {
  layout: ILayoutDataAndFilename;
  overlays: IOverlayAndFolderName[];
  onEdit: () => void;
  onDelete: () => void;
  onOpenOverlaySettings: (
    layoutOverlay: ILayoutOverlay,
    manifestOverlay: IOverlayAndFolderName,
  ) => void;
  onRemoveOverlay: (overlayId: string) => void;
  onSetActiveLayout: (layoutFolderName: ILayoutDataAndFilename) => void;
}

export function LayoutCard({
  layout,
  overlays,
  onEdit,
  onDelete,
  onOpenOverlaySettings,
  onRemoveOverlay,
  onSetActiveLayout,
}: LayoutCardProps) {
  return (
    <Card
      key={layout.filename}
      className={`overflow-hidden transition-all duration-200 ${
        layout.data.active
          ? "border-primary shadow-primary/20 shadow-md"
          : "hover:border-muted-foreground/20 hover:shadow-sm"
      }`}
    >
      <CardHeader className="space-y-1 pb-2">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{layout.data.name}</CardTitle>
              {layout.data.active && (
                <Badge
                  variant="default"
                  className="h-5 rounded-full px-2 text-[10px]"
                >
                  Active
                </Badge>
              )}
            </div>
            <CardDescription>
              {layout.data.description || "No description"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical size={16} />
                <span className="sr-only">Menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={onEdit}>
                <Edit size={16} className="mr-2" />
                Edit Layout
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={onDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 size={16} className="mr-2" />
                Delete Layout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-muted-foreground mb-3 flex items-center gap-2 border-b pb-2 text-sm">
          <Layers size={16} />
          <span className="font-medium">
            {layout.data.overlays.length} overlays
          </span>
        </div>

        {layout.data.overlays.length > 0 ? (
          <Accordion type="single" collapsible className="w-full">
            {layout.data.overlays.map((layoutOverlay) => {
              const manifestOverlay =
                overlays.filter(
                  (overlay) => overlay.folderName === layoutOverlay.folderName,
                )[0] || null;

              if (manifestOverlay === null) {
                return (
                  <AccordionItem
                    key={layoutOverlay.id}
                    value={layoutOverlay.id}
                    className="border-muted/60 border-b"
                  >
                    <AccordionTrigger className="px-1 py-2 text-sm hover:no-underline">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">
                          {layoutOverlay.name || layoutOverlay.folderName}
                        </span>
                        <Badge
                          variant="outline"
                          className="h-5 border-red-200 bg-red-50 px-2 text-[10px] font-normal text-red-600"
                        >
                          Missing
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-3 pt-1 pb-2">
                        <div className="rounded-md border border-red-100 bg-red-50/30 p-3 text-sm">
                          <div className="text-muted-foreground mb-1">
                            This overlay is missing or could not be found in
                            your overlays directory.
                          </div>
                          <div className="text-muted-foreground/80 text-xs">
                            It may have been deleted or renamed. You can safely
                            remove it from this layout.
                          </div>
                        </div>
                        <div className="flex justify-end pt-2">
                          <RemoveOverlayButton
                            overlayName={
                              layoutOverlay.name || layoutOverlay.folderName
                            }
                            onRemove={() => onRemoveOverlay(layoutOverlay.id)}
                          />
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              }

              return (
                <AccordionItem
                  key={layoutOverlay.id}
                  value={layoutOverlay.id}
                  className="border-muted/60 border-b"
                >
                  <AccordionTrigger className="px-1 py-2 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {layoutOverlay.name ||
                          manifestOverlay.data?.name ||
                          manifestOverlay.folderName}
                      </span>
                      {manifestOverlay.data?.type && (
                        <Badge
                          variant="outline"
                          className="h-5 px-2 text-[10px] font-normal"
                        >
                          {manifestOverlay.data.type}
                        </Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1 pb-2">
                      <div className="bg-muted/30 grid grid-cols-2 gap-2 rounded-md p-3 text-sm">
                        <div className="text-muted-foreground font-medium">
                          Position:
                        </div>
                        <div>
                          x: {layoutOverlay.position.x}, y:{" "}
                          {layoutOverlay.position.y}
                        </div>
                        <div className="text-muted-foreground font-medium">
                          Size:
                        </div>
                        <div>
                          {layoutOverlay.position.width} ×{" "}
                          {layoutOverlay.position.height}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1"
                          onClick={() =>
                            onOpenOverlaySettings(
                              layoutOverlay,
                              manifestOverlay,
                            )
                          }
                        >
                          <Settings size={14} />
                          Settings
                        </Button>
                        <RemoveOverlayButton
                          overlayName={
                            layoutOverlay.name ||
                            manifestOverlay.data?.name ||
                            manifestOverlay.folderName
                          }
                          onRemove={() => onRemoveOverlay(layoutOverlay.id)}
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="bg-muted/20 rounded-lg py-8 text-center">
            <p className="text-muted-foreground">No overlays added yet</p>
            <p className="mt-2 text-sm">
              <Link
                to="/my-overlays"
                className="text-primary font-medium hover:underline"
              >
                Add overlays
              </Link>{" "}
              to customize this layout
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 border-t pt-3">
        <div className="text-muted-foreground flex w-full justify-between text-xs">
          <span>
            Created: {new Date(layout.data.createdAt).toLocaleDateString()}
          </span>
          <span>
            Updated: {new Date(layout.data.updatedAt).toLocaleDateString()}
          </span>
        </div>
        <Button
          className="w-full"
          variant={layout.data.active ? "secondary" : "default"}
          onClick={() => onSetActiveLayout(layout)}
          disabled={layout.data.active}
        >
          {layout.data.active ? "Current Active Layout" : "Set as Active"}
        </Button>
      </CardFooter>
    </Card>
  );
}
