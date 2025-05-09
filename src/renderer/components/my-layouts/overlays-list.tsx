import { useOverlays } from "@/renderer/api/overlays/get-overlays";
import { ScrollArea } from "../ui/scroll-area";
import { useAddOverlayToLayout } from "@/renderer/api/layouts/add-overlay-to-layout";
import { useLayouts } from "@/renderer/api/layouts/get-layouts";
import { Button } from "../ui/button";
import {
  ASSETS_SERVER_PORT,
  OVERLAY_SERVER_PORT,
} from "@/shared/shared-constants";

const OverlaysList = () => {
  const overlays = useOverlays();
  const layouts = useLayouts();
  const activeLayout = layouts.data?.find((layout) => layout.data.active);
  const { mutate: addOverlayToLayout } = useAddOverlayToLayout();

  return (
    <div className="h-full overflow-hidden">
      <div className="bg-accent/10 flex h-full flex-col">
        <div className="flex-shrink-0 border-b p-3">
          <h2 className="text-lg font-semibold">Overlays</h2>
        </div>
        <ScrollArea className="overflow-y-auto">
          <div className="p-4">
            <div className="grid gap-4">
              {overlays.data &&
                overlays.data.map((overlay) => {
                  const iframeUrl = `http://localhost:${OVERLAY_SERVER_PORT}/${overlay.folderName}?preview=true`;

                  const paddingY = 60;
                  const iframeHeight = overlay.data.defaultHeight;
                  const parentHeight = 320;
                  const scale = Math.min(
                    (parentHeight - paddingY) / iframeHeight,
                    1,
                  );

                  return (
                    <div
                      key={overlay.folderName}
                      className="group relative flex items-center justify-center overflow-hidden rounded-md border shadow-sm transition-all duration-300 hover:shadow-md"
                      style={{
                        backgroundImage: `url(http://localhost:${ASSETS_SERVER_PORT}/images/27bf1719-f700-4529-86f7-70655aefb90c.png)`,
                        backgroundPosition: "center",
                        height: parentHeight,
                      }}
                    >
                      {/* Background overlay with blur effect on hover */}
                      <div className="backdrop-blur-0 absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/20 group-hover:backdrop-blur-sm"></div>

                      {/* Iframe with blur effect on hover */}
                      <div className="relative z-0 transition-all duration-300 group-hover:blur-sm">
                        <iframe
                          src={iframeUrl}
                          style={{
                            transform: `translate(-50%, -50%) scale(${scale})`,
                            transformOrigin: "center",
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                          }}
                          width={overlay.data.defaultWidth}
                          height={overlay.data.defaultHeight}
                          className="pointer-events-none"
                        ></iframe>
                      </div>

                      {/* Overlay name badge */}
                      <div className="absolute bottom-3 left-3 z-10 rounded bg-black/60 px-2 py-1 text-xs font-medium text-white">
                        {overlay.folderName}
                      </div>

                      {/* Button or message that appears on hover */}
                      <div className="absolute top-1/2 left-1/2 z-20 -translate-x-1/2 -translate-y-1/2 scale-0 transform opacity-0 transition-all duration-300 group-hover:scale-100 group-hover:opacity-100">
                        {activeLayout ? (
                          <Button
                            onClick={() => {
                              addOverlayToLayout({
                                layoutFileName: activeLayout.filename,
                                overlayFolderName: overlay.folderName,
                              });
                            }}
                            variant="outline"
                          >
                            Add To Layout
                          </Button>
                        ) : (
                          <div className="rounded-md bg-black/75 px-3 py-2 text-center text-sm text-white">
                            <p>No active layout</p>
                            <Button
                              variant="link"
                              className="h-auto p-0 text-xs text-blue-300 hover:text-blue-200"
                              onClick={() => {
                                // Navigate to layouts or activate a layout
                                // This would need to be implemented based on your app's navigation
                              }}
                            >
                              Select a layout first
                            </Button>
                          </div>
                        )}
                      </div>
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
