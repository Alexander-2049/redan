import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import {
  Edit,
  Layers,
  MoreVertical,
  Plus,
  Settings,
  Trash2,
} from "lucide-react";
import { Textarea } from "../components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
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
} from "../components/ui/alert-dialog";
import { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import { Badge } from "../components/ui/badge";

const MyLayoutsRoute = () => {
  const [layouts, setLayouts] = useState<LayoutDataAndFilename[]>([]);
  const [overlays, setOverlays] = useState<IOverlayAndFolderName[]>([]);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [layoutToDelete, setLayoutToDelete] =
    useState<LayoutDataAndFilename | null>(null);
  const [editingLayout, setEditingLayout] =
    useState<LayoutDataAndFilename | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [newLayoutName, setNewLayoutName] = useState("");
  const [newLayoutDescription, setNewLayoutDescription] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  const updateLayoutAndOverlayLists = useCallback(() => {
    setIsLoading(true);
    Promise.all([
      window.electron.getLayouts(),
      window.electron.getOverlayList(),
    ])
      .then(([layoutsData, overlaysData]) => {
        setLayouts(layoutsData);
        setOverlays(overlaysData);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [setLayouts]);

  const handleCloseCreateNewLayout = useCallback(() => {
    setIsCreateDialogOpen(false);
    setNewLayoutName("");
    setNewLayoutDescription("");
  }, []);

  const handleCreateNewLayout = useCallback(() => {
    if (newLayoutName.length === 0) {
      return toast.info("Please enter a name for the new layout.");
    }

    window.electron
      .createEmptyLayout(newLayoutName, newLayoutDescription)
      .then((response) => {
        if (response.success) {
          updateLayoutAndOverlayLists();
          handleCloseCreateNewLayout();
        } else {
          toast.error("Something went wrong...", {
            description: "Error: " + response.error /*
            action: {
              label: "Undo",
              onClick: () => console.log("Undo"),
            },
          */,
          });
        }
      })
      .catch((error) => {
        toast.error("Error...", { description: error.message });
        console.error("Error in createEmtpyLayout:", error);
      });
  }, [newLayoutName, newLayoutDescription]);

  const handleDeleteLayout = useCallback((fileName: string) => {
    window.electron
      .deleteLayout(fileName)
      .then((response) => {
        if (response.success) {
          updateLayoutAndOverlayLists();
          handleCloseCreateNewLayout();
          toast.success(`Layout "${fileName}" has been successfully deleted.`);
        } else {
          toast.error(`Something went wrong during "${fileName}" deletion.`, {
            description: response.error,
          });
        }
      })
      .catch((error) => {
        console.error("Error in deleteLayout:", error);
        toast.error(`Error caught during ${fileName} deletion.`, {
          description: error.message,
        });
      });
  }, []);

  const handleUpdateLayout = useCallback(() => {
    if (!editingLayout) return;

    if ((editingLayout.data.name || "").trim().length === 0) {
      return toast.info("Layout name cannot be empty.");
    }

    window.electron
      .modifyLayout(editingLayout.filename, editingLayout.data)
      .then((response) => {
        if (response.success) {
          toast.success("Layout updated", {
            description: "Your changes have been saved",
          });
          updateLayoutAndOverlayLists();

          setIsEditDialogOpen(false);
          setEditingLayout(null);
        } else {
          toast.error("Something went wrong...", {
            description: response.error,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error occured...", { description: error.message });
      });
  }, [editingLayout]);

  useEffect(() => {
    window.addEventListener("focus", updateLayoutAndOverlayLists);
    updateLayoutAndOverlayLists();
    return () => {
      window.removeEventListener("focus", updateLayoutAndOverlayLists);
    };
  }, []);

  return (
    <>
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            {/* Title */}
            <div>
              <h1 className="text-2xl font-bold">My Layouts</h1>
              <p className="text-gray-500">
                Manage and customize your overlay layouts
              </p>
            </div>

            {/* Create new layout button */}
            <Dialog
              open={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
            >
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus size={16} />
                  Create New Layout
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Layout</DialogTitle>
                  <DialogDescription>
                    Create a new layout to organize your stream overlays.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Layout Name
                    </label>
                    <Input
                      id="name"
                      value={newLayoutName}
                      onChange={(e) => setNewLayoutName(e.target.value)}
                      placeholder="My Stream Layout"
                      maxLength={64}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="description"
                      className="text-sm font-medium"
                    >
                      Description (optional)
                    </label>
                    <Textarea
                      id="description"
                      value={newLayoutDescription}
                      onChange={(e) => setNewLayoutDescription(e.target.value)}
                      placeholder="Describe what this layout is for..."
                      rows={3}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => handleCloseCreateNewLayout}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleCreateNewLayout}>Create Layout</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {/* Edit layout dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Layout</DialogTitle>
                <DialogDescription>
                  Update your layout information.
                </DialogDescription>
              </DialogHeader>
              {editingLayout && (
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="edit-name" className="text-sm font-medium">
                      Layout Name
                    </label>
                    <Input
                      id="edit-name"
                      value={editingLayout.data.name}
                      onChange={(e) =>
                        setEditingLayout({
                          ...editingLayout,
                          data: { ...editingLayout.data, name: e.target.value },
                        })
                      }
                      placeholder="Layout Name"
                      maxLength={64}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label
                      htmlFor="edit-description"
                      className="text-sm font-medium"
                    >
                      Description
                    </label>
                    <Textarea
                      id="edit-description"
                      value={editingLayout.data.description}
                      onChange={(e) =>
                        setEditingLayout({
                          ...editingLayout,
                          data: {
                            ...editingLayout.data,
                            description: e.target.value,
                          },
                        })
                      }
                      placeholder="Describe what this layout is for..."
                      rows={3}
                    />
                  </div>
                </div>
              )}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateLayout}>Save Changes</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Delete Layout AlertDialog */}
          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the "{layoutToDelete?.data.name}"
                  layout and all its overlays. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={() =>
                    layoutToDelete &&
                    handleDeleteLayout(layoutToDelete.filename)
                  }
                  className="bg-destructive hover:bg-destructive/90 text-white"
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* Content */}

          {/* Layouts grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {layouts
              .sort((a, b) => (b.data.updatedAt || 0) - (a.data.updatedAt || 0))
              .map((layout) => (
                <Card key={layout.filename} className="overflow-hidden">
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
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingLayout(layout);
                              setIsEditDialogOpen(true);
                            }}
                          >
                            <Edit size={16} className="mr-2" />
                            Edit Layout
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onSelect={() => {
                              setIsDeleteDialogOpen(true);
                              setLayoutToDelete(layout);
                            }}
                          >
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
                              (overlay) =>
                                overlay.folderName === layoutOverlay.folderName,
                            )[0] || {};

                          return (
                            <AccordionItem
                              key={layoutOverlay.id}
                              value={layoutOverlay.folderName}
                            >
                              <AccordionTrigger className="px-1 py-2 text-sm hover:no-underline">
                                <div className="flex items-center gap-2">
                                  <span>
                                    {manifestOverlay.data.name ||
                                      manifestOverlay.folderName}
                                  </span>
                                  {manifestOverlay.data.type && (
                                    <Badge>{manifestOverlay.data.type}</Badge>
                                  )}
                                </div>
                              </AccordionTrigger>
                              <AccordionContent>
                                <div className="space-y-3 pt-1 pb-2">
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div className="text-muted-foreground">
                                      Position:
                                    </div>
                                    <div>
                                      x: {layoutOverlay.position.x}, y:{" "}
                                      {layoutOverlay.position.y}
                                    </div>
                                    <div className="text-muted-foreground">
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
                                            {manifestOverlay.data.name}" overlay
                                            from this layout.
                                          </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                          <AlertDialogCancel>
                                            Cancel
                                          </AlertDialogCancel>
                                          <AlertDialogAction
                                          // onClick={() =>
                                          //   handleDeleteOverlay(
                                          //     layout.filename,
                                          //     layoutOverlay.id,
                                          //   )
                                          // }
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
                          Add overlays to customize this layout
                        </p>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="text-muted-foreground flex justify-between pt-2 text-xs">
                    <span>
                      Created:{" "}
                      {new Date(layout.data.createdAt).toLocaleDateString()}
                    </span>
                    <span>
                      Updated:{" "}
                      {new Date(layout.data.updatedAt).toLocaleDateString()}
                    </span>
                  </CardFooter>
                </Card>
              ))}
          </div>

          {layouts.length === 0 && !isLoading && (
            <div className="py-12 text-center">
              <h3 className="text-lg font-medium">No layouts found</h3>
              <p className="text-muted-foreground mt-1">
                Create your first layout to get started
              </p>
              <Button
                className="mt-4 gap-2"
                onClick={() => setIsCreateDialogOpen(true)}
              >
                <Plus size={16} />
                Create New Layout
              </Button>
            </div>
          )}

          {/* <div>
            <Input
              value={newLayoutName}
              onChange={(event) => setNewLayoutName(event.target.value)}
              className="bg-white"
              placeholder="File name"
              maxLength={64}
            />
            <Button onClick={handleCreateNewLayout}>Create new layout</Button>
            {layouts
              .sort((a, b) => (b.data.createdAt || 0) - (a.data.createdAt || 0))
              .map((layout) => (
                <Accordion
                  type="multiple"
                  className="overflow-hidden rounded-md border-2"
                  key={layout.filename}
                >
                  <AccordionItem value="item-1" className="bg-card px-2">
                    <AccordionTrigger className="hover:cursor-pointer">
                      {layout.data.name || "No layout name"}
                    </AccordionTrigger>
                    <AccordionContent>
                      <pre>{JSON.stringify(layout, null, "  ")}</pre>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
          </div> */}
        </div>
      </div>
    </>
  );
};

export default MyLayoutsRoute;
