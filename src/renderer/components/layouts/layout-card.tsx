import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/renderer/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/renderer/components/ui/alert-dialog";
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
import type { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import { Edit, Layers, MoreVertical, Settings, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { ILayoutOverlay } from "@/main/services/layoutService/schemas/overlaySchema";

interface LayoutCardProps {
  layout: LayoutDataAndFilename;
  overlays: IOverlayAndFolderName[];
  onEdit: () => void;
  onDelete: () => void;
  onOpenOverlaySettings: (
    layoutOverlay: ILayoutOverlay,
    manifestOverlay: IOverlayAndFolderName,
  ) => void;
  onRemoveOverlay: (overlayId: string) => void;
  onSetActiveLayout: (layoutFolderName: LayoutDataAndFilename) => void;
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
        layout.data.active ? "border-primary shadow-primary/20 shadow-md" : ""
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>{layout.data.name}</CardTitle>
            <CardDescription className="mt-1">
              {layout.data.description || "No description"}
            </CardDescription>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
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
              <DropdownMenuItem onSelect={onDelete}>
                <Trash2 size={16} className="mr-2" />
                Delete Layout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="text-muted-foreground mb-4 flex items-center gap-2 text-sm">
          <Layers size={16} />
          <span>{layout.data.overlays.length} overlays</span>
        </div>

        {layout.data.overlays.length > 0 ? (
          <Accordion type="multiple" className="w-full">
            {layout.data.overlays.map((layoutOverlay) => {
              const manifestOverlay =
                overlays.filter(
                  (overlay) => overlay.folderName === layoutOverlay.folderName,
                )[0] || {};

              return (
                <AccordionItem
                  key={layoutOverlay.id}
                  value={layoutOverlay.folderName}
                >
                  <AccordionTrigger className="px-1 py-2 text-sm hover:no-underline">
                    <div className="flex items-center gap-2">
                      <span>
                        {manifestOverlay.data?.name ||
                          manifestOverlay.folderName}
                      </span>
                      {manifestOverlay.data?.type && (
                        <Badge>{manifestOverlay.data.type}</Badge>
                      )}
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-3 pt-1 pb-2">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Position:</div>
                        <div>
                          x: {layoutOverlay.position.x}, y:{" "}
                          {layoutOverlay.position.y}
                        </div>
                        <div className="text-muted-foreground">Size:</div>
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 size={14} className="mr-1" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove overlay?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove the "
                                {manifestOverlay.data?.name}" overlay from this
                                layout.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  onRemoveOverlay(layoutOverlay.id)
                                }
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        ) : (
          <div className="text-muted-foreground py-6 text-center">
            <p>No overlays added yet</p>
            <p className="mt-1 text-sm">
              <Link
                to="/my-overlays"
                className="text-blue-400 hover:cursor-pointer hover:underline"
              >
                Add overlays
              </Link>{" "}
              to customize this layout
            </p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col gap-3 pt-2">
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
          variant={layout.data.active ? "default" : "outline"}
          onClick={() => onSetActiveLayout(layout)}
          disabled={layout.data.active}
        >
          {layout.data.active ? "Active Layout" : "Set as Active"}
        </Button>
      </CardFooter>
    </Card>
  );
}
