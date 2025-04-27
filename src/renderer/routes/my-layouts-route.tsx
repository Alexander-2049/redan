"use client";

import { useCallback, useEffect, useState } from "react";
import type { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import { Plus } from "lucide-react";
import { Button } from "../components/ui/button";
import { toast } from "sonner";
import { LayoutCard } from "../components/my-layouts/layout-card";
import { CreateLayoutDialog } from "../components/my-layouts/create-layout-dialog";
import { EditLayoutDialog } from "../components/my-layouts/edit-layout-dialog";
import { DeleteLayoutDialog } from "../components/my-layouts/delete-layout-dialog";
import { OverlaySettingsDialog } from "../components/my-layouts/overlay-settings-dialog";
import { ILayoutOverlay } from "@/main/services/layoutService/schemas/overlaySchema";

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
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);
  const [selectedOverlay, setSelectedOverlay] = useState<{
    layoutFileName: string;
    layoutOverlay: ILayoutOverlay;
    manifestOverlay: IOverlayAndFolderName;
  } | null>(null);

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
            description: "Error: " + response.error,
          });
        }
      })
      .catch((error) => {
        toast.error("Error...", { description: error.message });
        console.error("Error in createEmtpyLayout:", error);
      });
  }, [newLayoutName, newLayoutDescription, handleCloseCreateNewLayout]);

  const handleDeleteLayout = useCallback(
    (fileName: string) => {
      window.electron
        .deleteLayout(fileName)
        .then((response) => {
          if (response.success) {
            updateLayoutAndOverlayLists();
            setIsDeleteDialogOpen(false);
            toast.success(
              `Layout "${fileName}" has been successfully deleted.`,
            );
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
    },
    [updateLayoutAndOverlayLists],
  );

  const handleRemoveOverlayFromLayout = useCallback(
    (layoutFileName: string, overlayId: string) => {
      window.electron
        .removeOverlayFromLayout(layoutFileName, overlayId)
        .then((response) => {
          if (response.success) {
            updateLayoutAndOverlayLists();
            toast.success(
              `Overlay has been successfully deleted from ${layoutFileName}.`,
            );
          } else {
            toast.error(
              `Something went wrong during "${overlayId}" deletion.`,
              {
                description: response.error,
              },
            );
          }
        })
        .catch((error) => {
          console.error("Error in deleteLayout:", error);
          toast.error(`Error caught during ${overlayId} deletion.`, {
            description: error.message,
          });
        });
    },
    [updateLayoutAndOverlayLists],
  );

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
  }, [editingLayout, updateLayoutAndOverlayLists]);

  const handleSaveOverlaySettings = useCallback(() => {
    if (!selectedOverlay) return;

    window.electron
      .modifyLayout(selectedOverlay.layoutFileName, {
        ...layouts.find((l) => l.filename === selectedOverlay.layoutFileName)
          ?.data,
        overlays: layouts
          .find((l) => l.filename === selectedOverlay.layoutFileName)
          ?.data.overlays.map((o) =>
            o.id === selectedOverlay.layoutOverlay.id
              ? selectedOverlay.layoutOverlay
              : o,
          ),
      })
      .then((response) => {
        if (response.success) {
          toast.success("Overlay settings updated", {
            description: "Your changes have been saved",
          });
          updateLayoutAndOverlayLists();
          setIsSettingsDialogOpen(false);
          setSelectedOverlay(null);
        } else {
          toast.error("Something went wrong...", {
            description: response.error,
          });
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error("Error occurred...", { description: error.message });
      });
  }, [selectedOverlay, layouts, updateLayoutAndOverlayLists]);

  const handleSetActiveLayout = useCallback((layout: LayoutDataAndFilename) => {
    window.electron
      .setActiveLayout(layout.filename)
      .then((response) => {
        if (response.success) {
          toast.success("Active layout has been updated");
        } else {
          console.error("Failed to set active layout:", response.error);
          toast.error("Failed to set active layout", {
            description: response.error,
          });
        }
      })
      .catch((error) => {
        console.error("Error in setActiveLayout:", error);
        toast.error("An error occurred while setting the active layout", {
          description: error.message,
        });
      })
      .finally(() => updateLayoutAndOverlayLists());
  }, []);

  useEffect(() => {
    window.addEventListener("focus", updateLayoutAndOverlayLists);
    updateLayoutAndOverlayLists();
    return () => {
      window.removeEventListener("focus", updateLayoutAndOverlayLists);
    };
  }, [updateLayoutAndOverlayLists]);

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
            <CreateLayoutDialog
              isOpen={isCreateDialogOpen}
              onOpenChange={setIsCreateDialogOpen}
              layoutName={newLayoutName}
              layoutDescription={newLayoutDescription}
              onLayoutNameChange={setNewLayoutName}
              onLayoutDescriptionChange={setNewLayoutDescription}
              onClose={handleCloseCreateNewLayout}
              onCreate={handleCreateNewLayout}
            />
          </div>

          {/* Edit layout dialog */}
          <EditLayoutDialog
            isOpen={isEditDialogOpen}
            onOpenChange={setIsEditDialogOpen}
            layout={editingLayout}
            onLayoutChange={setEditingLayout}
            onSave={handleUpdateLayout}
          />

          {/* Delete Layout AlertDialog */}
          <DeleteLayoutDialog
            isOpen={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
            layout={layoutToDelete}
            onDelete={() =>
              layoutToDelete && handleDeleteLayout(layoutToDelete.filename)
            }
          />

          {/* Overlay Settings Dialog */}
          <OverlaySettingsDialog
            isOpen={isSettingsDialogOpen}
            onOpenChange={(open) => {
              if (!open) {
                setSelectedOverlay(null);
              }
              setIsSettingsDialogOpen(open);
            }}
            selectedOverlay={selectedOverlay}
            onOverlayChange={setSelectedOverlay}
            onSave={handleSaveOverlaySettings}
          />

          {/* Layouts grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {layouts
              .sort((a, b) => (b.data.updatedAt || 0) - (a.data.updatedAt || 0))
              .map((layout) => (
                <LayoutCard
                  key={layout.filename}
                  layout={layout}
                  overlays={overlays}
                  onEdit={() => {
                    setEditingLayout(layout);
                    setIsEditDialogOpen(true);
                  }}
                  onDelete={() => {
                    setIsDeleteDialogOpen(true);
                    setLayoutToDelete(layout);
                  }}
                  onOpenOverlaySettings={(layoutOverlay, manifestOverlay) => {
                    setSelectedOverlay({
                      layoutFileName: layout.filename,
                      layoutOverlay,
                      manifestOverlay,
                    });
                    setIsSettingsDialogOpen(true);
                  }}
                  onRemoveOverlay={(overlayId) =>
                    handleRemoveOverlayFromLayout(layout.filename, overlayId)
                  }
                  onSetActiveLayout={handleSetActiveLayout}
                />
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
        </div>
      </div>
    </>
  );
};

export default MyLayoutsRoute;
