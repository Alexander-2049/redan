import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import type { ILayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import { OverlaysHeader } from "@/renderer/components/my-overlays/overlays-header";
import { OverlaysToolbar } from "@/renderer/components/my-overlays/overlays-toolbar";
import { OverlaysGrid } from "@/renderer/components/my-overlays/overlays-grid";
import { OverlaysList } from "@/renderer/components/my-overlays/overlays-list";

const MyOverlaysRoute = () => {
  const navigate = useNavigate();
  const [overlays, setOverlays] = useState<IOverlayAndFolderName[]>([]);
  const [layouts, setLayouts] = useState<ILayoutDataAndFilename[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const filteredOverlays = overlays.filter(
    (overlay) =>
      (overlay.data.name || "")
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      overlay.data.description
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()),
  );

  const updateOverlayList = useCallback(() => {
    setIsLoading(true);
    window.electron
      .getOverlayList()
      .then((data) => {
        setOverlays(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [setOverlays]);

  const updateLayoutList = useCallback(() => {
    setIsLoading(true);
    window.electron
      .getLayouts()
      .then((data) => {
        setLayouts(data);
      })
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, [setLayouts]);

  const handleAddOverlayToLayout = useCallback(
    (layoutFileName: string, overlayFolderName: string) => {
      window.electron
        .addOverlayToLayout(layoutFileName, overlayFolderName)
        .then((response) => {
          if (response.success) {
            toast.success("Overlay successfully added to layout!", {
              action: {
                label: "View Layouts",
                onClick: () => {
                  navigate("/my-layouts");
                },
              },
            });
          } else {
            toast.error("Error occured...", { description: response.error });
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Error occured...", { description: error.message });
        });
    },
    [navigate],
  );

  useEffect(() => {
    window.addEventListener("focus", updateOverlayList);
    window.addEventListener("focus", updateLayoutList);
    updateOverlayList();
    updateLayoutList();
    return () => {
      window.removeEventListener("focus", updateOverlayList);
      window.removeEventListener("focus", updateLayoutList);
    };
  }, [updateOverlayList, updateLayoutList]);

  return (
    <div className="flex-1 overflow-auto">
      <div className="p-6">
        <OverlaysHeader />

        <OverlaysToolbar
          viewMode={viewMode}
          setViewMode={setViewMode}
          overlayCount={filteredOverlays.length}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {viewMode === "grid" ? (
          <OverlaysGrid
            overlays={filteredOverlays}
            layouts={layouts}
            onAddToLayout={handleAddOverlayToLayout}
          />
        ) : (
          <OverlaysList
            overlays={filteredOverlays}
            layouts={layouts}
            onAddToLayout={handleAddOverlayToLayout}
          />
        )}
      </div>
    </div>
  );
};

export default MyOverlaysRoute;
