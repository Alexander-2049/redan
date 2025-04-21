"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/renderer/components/ui/accordion";
import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { Textarea } from "@/renderer/components/ui/textarea";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/renderer/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
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
import {
  Edit,
  MoreVertical,
  Plus,
  Trash2,
  Settings,
  Layers,
} from "lucide-react";

// Define types for our data structures
interface OverlaySettings {
  [key: string]: unknown;
}

interface Overlay {
  id: string;
  name: string;
  type: string;
  settings: OverlaySettings;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface LayoutData {
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  overlays: Overlay[];
}

interface LayoutDataAndFilename {
  filename: string;
  data: LayoutData;
}

// Mock data for layouts
const mockLayouts: LayoutDataAndFilename[] = [
  {
    filename: "stream-layout-1.json",
    data: {
      name: "Stream Layout 1",
      description: "Main layout for streaming gameplay",
      createdAt: Date.now() - 1000000,
      updatedAt: Date.now() - 500000,
      overlays: [
        {
          id: "webcam-1",
          name: "Webcam Overlay",
          type: "webcam",
          settings: {
            source: "Logitech C920",
            borderRadius: 8,
            borderColor: "#ff5500",
            borderWidth: 2,
          },
          position: { x: 20, y: 20, width: 320, height: 240 },
        },
        {
          id: "scoreboard-1",
          name: "Game Scoreboard",
          type: "scoreboard",
          settings: {
            team1Name: "Team Alpha",
            team2Name: "Team Beta",
            showLogo: true,
            backgroundColor: "rgba(0,0,0,0.7)",
          },
          position: { x: 400, y: 20, width: 400, height: 100 },
        },
      ],
    },
  },
  {
    filename: "tournament-layout.json",
    data: {
      name: "Tournament Layout",
      description:
        "Layout for tournament broadcasts with multiple information panels",
      createdAt: Date.now() - 2000000,
      updatedAt: Date.now() - 100000,
      overlays: [
        {
          id: "player-stats-1",
          name: "Player Statistics",
          type: "stats",
          settings: {
            showKDA: true,
            showGPM: true,
            refreshRate: 5,
            theme: "dark",
          },
          position: { x: 50, y: 50, width: 300, height: 400 },
        },
        {
          id: "timer-1",
          name: "Match Timer",
          type: "timer",
          settings: {
            format: "mm:ss",
            showMilliseconds: false,
            countDirection: "down",
            startTime: 300,
          },
          position: { x: 500, y: 30, width: 200, height: 80 },
        },
        {
          id: "lower-third-1",
          name: "Lower Third",
          type: "lowerThird",
          settings: {
            primaryText: "Tournament Finals",
            secondaryText: "$10,000 Prize Pool",
            animation: "slideIn",
            duration: 10,
          },
          position: { x: 200, y: 600, width: 800, height: 120 },
        },
      ],
    },
  },
];

const MyLayoutsRoute = () => {
  const [layouts, setLayouts] = useState<LayoutDataAndFilename[]>(mockLayouts);
  const [newLayoutName, setNewLayoutName] = useState("");
  const [newLayoutDescription, setNewLayoutDescription] = useState("");
  const [editingLayout, setEditingLayout] =
    useState<LayoutDataAndFilename | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  // Simulate fetching layouts from electron
  const updateLayoutList = useCallback(() => {
    // In a real app, this would call window.electron.getLayouts()
    setLayouts(mockLayouts);
  }, []);

  // Create a new layout
  const handleCreateNewLayout = useCallback(() => {
    if (newLayoutName.trim().length === 0) {
      return toast.error("Please enter a name for the new layout.");
    }

    const newLayout: LayoutDataAndFilename = {
      filename: `${newLayoutName.toLowerCase().replace(/\s+/g, "-")}-${Date.now()}.json`,
      data: {
        name: newLayoutName,
        description: newLayoutDescription,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        overlays: [],
      },
    };

    setLayouts((prev) => [...prev, newLayout]);
    setNewLayoutName("");
    setNewLayoutDescription("");
    setIsCreateDialogOpen(false);

    toast.success("Layout created successfully", {
      description: `"${newLayoutName}" has been added to your layouts`,
    });
  }, [newLayoutName, newLayoutDescription]);

  // Delete a layout
  const handleDeleteLayout = useCallback((filename: string) => {
    setLayouts((prev) => prev.filter((layout) => layout.filename !== filename));
    toast.success("Layout deleted", {
      description: "The layout has been permanently removed",
    });
  }, []);

  // Update layout name and description
  const handleUpdateLayout = useCallback(() => {
    if (!editingLayout) return;

    if (editingLayout.data.name.trim().length === 0) {
      return toast.error("Layout name cannot be empty");
    }

    setLayouts((prev) =>
      prev.map((layout) =>
        layout.filename === editingLayout.filename
          ? {
              ...layout,
              data: {
                ...layout.data,
                name: editingLayout.data.name,
                description: editingLayout.data.description,
                updatedAt: Date.now(),
              },
            }
          : layout,
      ),
    );

    setIsEditDialogOpen(false);
    setEditingLayout(null);

    toast.success("Layout updated", {
      description: "Your changes have been saved",
    });
  }, [editingLayout]);

  // Delete an overlay from a layout
  const handleDeleteOverlay = useCallback(
    (layoutFilename: string, overlayId: string) => {
      setLayouts((prev) =>
        prev.map((layout) =>
          layout.filename === layoutFilename
            ? {
                ...layout,
                data: {
                  ...layout.data,
                  overlays: layout.data.overlays.filter(
                    (overlay) => overlay.id !== overlayId,
                  ),
                  updatedAt: Date.now(),
                },
              }
            : layout,
        ),
      );

      toast.success("Overlay removed", {
        description: "The overlay has been removed from this layout",
      });
    },
    [],
  );

  // Initialize on component mount
  useEffect(() => {
    window.addEventListener("focus", updateLayoutList);
    updateLayoutList();
    return () => {
      window.removeEventListener("focus", updateLayoutList);
    };
  }, [updateLayoutList]);

  return (
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
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setNewLayoutName(e.target.value)
                    }
                    placeholder="My Stream Layout"
                    maxLength={64}
                  />
                </div>
                <div className="grid gap-2">
                  <label htmlFor="description" className="text-sm font-medium">
                    Description (optional)
                  </label>
                  <Textarea
                    id="description"
                    value={newLayoutDescription}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setNewLayoutDescription(e.target.value)
                    }
                    placeholder="Describe what this layout is for..."
                    rows={3}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
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
                    value={editingLayout?.data.name}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEditingLayout((prev: LayoutDataAndFilename | null) =>
                        prev
                          ? {
                              ...prev,
                              data: { ...prev.data, name: e.target.value },
                            }
                          : null,
                      )
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
                    value={editingLayout?.data.description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setEditingLayout((prev) =>
                        prev
                          ? {
                              ...prev,
                              data: {
                                ...prev.data,
                                description: e.target.value,
                              },
                            }
                          : null,
                      )
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <DropdownMenuItem
                              onSelect={(e) => (e as Event).preventDefault()}
                            >
                              <Trash2 size={16} className="mr-2" />
                              Delete Layout
                            </DropdownMenuItem>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete the "
                                {layout.data.name}" layout and all its overlays.
                                This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleDeleteLayout(layout.filename)
                                }
                                className="bg-destructive hover:bg-destructive/90 text-white"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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
                      {layout.data.overlays.map((overlay) => (
                        <AccordionItem key={overlay.id} value={overlay.id}>
                          <AccordionTrigger className="px-1 py-2 text-sm hover:no-underline">
                            <div className="flex items-center gap-2">
                              <span>{overlay.name}</span>
                              <Badge variant="outline" className="ml-2">
                                {overlay.type}
                              </Badge>
                            </div>
                          </AccordionTrigger>
                          <AccordionContent>
                            <div className="space-y-3 pt-1 pb-2">
                              <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="text-muted-foreground">
                                  Position:
                                </div>
                                <div>
                                  x: {overlay.position.x}, y:{" "}
                                  {overlay.position.y}
                                </div>
                                <div className="text-muted-foreground">
                                  Size:
                                </div>
                                <div>
                                  {overlay.position.width} ×{" "}
                                  {overlay.position.height}
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
                                        This will remove the "{overlay.name}"
                                        overlay from this layout.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleDeleteOverlay(
                                            layout.filename,
                                            overlay.id,
                                          )
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
                      ))}
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

        {layouts.length === 0 && (
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
      </div>
    </div>
  );
};

export default MyLayoutsRoute;
