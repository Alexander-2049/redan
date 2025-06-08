import { useOverlays } from "@/renderer/api/overlays/get-overlays";
import { ScrollArea } from "../ui/scroll-area";
import { useAddOverlayToLayout } from "@/renderer/api/layouts/add-overlay-to-layout";
import { useLayouts } from "@/renderer/api/layouts/get-layouts";
import { Button } from "../ui/button";
import { ASSETS_URL, OVERLAY_SERVER_PORT } from "@/shared/shared-constants";
import OpenOverlaysFolderButton from "../open-overlays-folder-button";
import { useState, useEffect } from "react";
import { Plus, Layout } from "lucide-react";

const useViewportWidth = () => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
    };

    // Set initial width
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const NoLayoutGuide = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center">
        {/* Main Icon */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-6 shadow-lg">
            <Layout className="h-16 w-16 text-white" />
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="mb-4 text-4xl font-bold text-gray-800">
          Create Your First Layout
        </h1>

        <p className="mb-8 text-lg text-gray-600">
          Layouts help you organize and display your overlays exactly where you
          want them. Start by creating a new layout to begin adding your
          overlays.
        </p>

        {/* Steps Guide */}
        <div className="mb-12 space-y-6">
          <div className="flex items-start space-x-4 rounded-lg bg-blue-50 p-6 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 font-semibold text-white">
              1
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Create a New Layout
              </h3>
              <p className="text-gray-600">
                Click the "New Layout" button in the bottom left corner to get
                started.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rounded-lg bg-green-50 p-6 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 font-semibold text-white">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">Add Your Overlays</h3>
              <p className="text-gray-600">
                Once your layout is active, you'll be able to add overlays from
                this panel.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4 rounded-lg bg-purple-50 p-6 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500 font-semibold text-white">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Customize & Configure
              </h3>
              <p className="text-gray-600">
                Position and configure your overlays using the layout settings
                panel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const OverlaysList = () => {
  const overlays = useOverlays();
  const layouts = useLayouts();
  const activeLayout = layouts.data?.find((layout) => layout.data.active);
  const { mutate: addOverlayToLayout } = useAddOverlayToLayout();
  const viewportWidth = useViewportWidth();

  // Check if there are no layouts or no active layout
  const hasNoLayouts = !layouts.data || layouts.data.length === 0;
  const hasNoActiveLayout = !activeLayout;

  // Show guide if no layouts exist or no layout is active
  if (hasNoLayouts || hasNoActiveLayout) {
    return (
      <div className="h-full overflow-hidden">
        <div className="bg-accent/10 flex h-full flex-col">
          <div className="flex flex-shrink-0 flex-row justify-between border-b p-3">
            <h2 className="text-lg font-semibold">Overlays</h2>
            <OpenOverlaysFolderButton />
          </div>
          <NoLayoutGuide />
        </div>
      </div>
    );
  }

  // Determine grid columns based on viewport width
  const getGridColumns = () => {
    if (viewportWidth >= 2900) {
      return "grid-cols-3";
    } else if (viewportWidth >= 1900) {
      return "grid-cols-2";
    } else {
      return "grid-cols-1";
    }
  };

  return (
    <div className="h-full overflow-hidden">
      <div className="bg-accent/10 flex h-full flex-col">
        <div className="flex flex-shrink-0 flex-row justify-between border-b p-3">
          <h2 className="text-lg font-semibold">Overlays</h2>
          <OpenOverlaysFolderButton />
        </div>
        <ScrollArea className="overflow-y-auto">
          <div className="p-4">
            <div className={`grid gap-4 ${getGridColumns()}`}>
              {overlays.data &&
                overlays.data.map((overlay) => {
                  const iframeUrl = `http://localhost:${OVERLAY_SERVER_PORT}/${overlay.folderName}?preview=true`;

                  const paddingY = 60;
                  const iframeHeight = overlay.data.defaultHeight;
                  const parentHeight = 450;
                  const scale = Math.min(
                    (parentHeight - paddingY) / iframeHeight,
                    1,
                  );

                  return (
                    <div
                      key={overlay.folderName}
                      className="group relative overflow-hidden rounded-md border shadow-sm transition-all duration-300 hover:shadow-lg"
                      style={{
                        backgroundImage: `url(${ASSETS_URL}/images/27bf1719-f700-4529-86f7-70655aefb90c.png)`,
                        backgroundPosition: "center",
                        backgroundSize: "cover",
                        height: parentHeight,
                      }}
                    >
                      {/* Background overlay that darkens on hover */}
                      <div className="absolute inset-0 bg-black/0 transition-all duration-300 group-hover:bg-black/30"></div>

                      {/* Main content container */}
                      <div className="relative h-full w-full transition-transform duration-300">
                        {/* Iframe container */}
                        <div className="relative z-0 flex h-full items-center justify-center">
                          <iframe
                            src={iframeUrl}
                            style={{
                              transform: `scale(${scale})`,
                              transformOrigin: "center",
                            }}
                            width={overlay.data.defaultWidth}
                            height={overlay.data.defaultHeight}
                            className="pointer-events-none transition-all duration-300 group-hover:scale-105"
                          ></iframe>
                        </div>

                        {/* Overlay name */}
                        <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-6">
                          <h3 className="text-xl font-bold text-white drop-shadow-lg">
                            {overlay.data.name || overlay.folderName}
                          </h3>
                        </div>
                      </div>

                      {/* Add button - circular floating button */}
                      <div className="absolute right-4 bottom-4 z-20">
                        {activeLayout ? (
                          <Button
                            onClick={() => {
                              addOverlayToLayout({
                                layoutFileName: activeLayout.filename,
                                overlayFolderName: overlay.folderName,
                              });
                            }}
                            className="translate-y-4 rounded-full border border-white/20 bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-3 font-semibold text-white opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 hover:scale-105 hover:shadow-xl"
                          >
                            <Plus className="mr-2 h-5 w-5" />
                            Add to Layout
                          </Button>
                        ) : (
                          <div className="translate-y-4 cursor-not-allowed rounded-full border border-white/20 bg-gradient-to-r from-gray-400 to-gray-500 px-6 py-3 font-semibold text-white/70 opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                            <Plus className="mr-2 inline h-5 w-5" />
                            No Layout
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
