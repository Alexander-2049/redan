import { useOverlays } from "@/renderer/api/overlays/get-overlays";
import { ScrollArea } from "../ui/scroll-area";
import { useAddOverlayToLayout } from "@/renderer/api/layouts/add-overlay-to-layout";
import { useLayouts } from "@/renderer/api/layouts/get-layouts";
import { Button } from "../ui/button";

const OverlaysList = () => {
  const overlays = useOverlays();
  const layouts = useLayouts();
  const { mutate: addOverlayToLayout } = useAddOverlayToLayout();

  return (
    <div className="h-full overflow-hidden">
      <div className="bg-accent/10 flex h-full flex-col">
        <div className="flex-shrink-0 border-b p-3">
          <h2 className="text-lg font-semibold">Overlays</h2>
        </div>
        <ScrollArea className="overflow-y-auto">
          <div className="p-4">
            {/* Your overlays content here */}
            <div className="grid gap-4">
              {/* {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="bg-card h-20 rounded-md border p-4">
                  Overlay {i + 1}
                </div>
              ))} */}
              {overlays.data &&
                overlays.data.map((overlay) => {
                  return (
                    <div
                      key={overlay.folderName}
                      className="bg-card rounded-md border p-4"
                    >
                      <h3 className="font-bold">
                        {overlay.data.name || overlay.folderName}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {overlay.data.description}
                      </p>
                      <Button
                        onClick={() => {
                          const activeLayout = layouts.data?.find(
                            (layout) => layout.data.active,
                          );
                          if (activeLayout) {
                            addOverlayToLayout({
                              layoutFileName: activeLayout.filename,
                              overlayFolderName: overlay.folderName,
                            });
                          }
                        }}
                      >
                        Add To Layout
                      </Button>
                    </div>
                  );
                })}
              {overlays.data?.length === 0 && (
                <div className="text-center text-gray-500">
                  No overlays available.
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OverlaysList;
