import { IOverlay } from "@/shared/types/IOverlay";
import { useCallback, useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import {
  Download,
  Edit,
  LayoutGrid,
  List,
  Search,
  Share2,
  SlidersHorizontal,
  SquareArrowOutUpRight,
  Trash2,
} from "lucide-react";
import { Input } from "../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import { Badge } from "../components/ui/badge";

const MyOverlaysRoute = () => {
  const [overlays, setOverlays] = useState<IOverlay[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const updateOverlayList = useCallback(() => {
    window.electron
      .getOverlayList()
      .then((data) => setOverlays(data))
      .catch((error) => console.error(error));
  }, [setOverlays]);

  useEffect(() => {
    window.addEventListener("focus", updateOverlayList);
    updateOverlayList();
    return () => {
      window.removeEventListener("focus", updateOverlayList);
    };
  }, []);

  return (
    <>
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">My Overlays</h1>
              <p className="text-gray-500">
                Manage and customize your racing overlays
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={window.electron.openOverlaysFolder}
              >
                <SquareArrowOutUpRight className="mr-1 h-4 w-4" />
                Open Overlays folder
              </Button>
              <Button variant="outline" size="sm">
                <SlidersHorizontal className="mr-1 h-4 w-4" />
                Filter
              </Button>
            </div>
          </div>
          {/* View Toggle and Search */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center overflow-hidden rounded-md border">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("grid")}
                >
                  <LayoutGrid className="mr-1 h-4 w-4" />
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-none"
                  onClick={() => setViewMode("list")}
                >
                  <List className="mr-1 h-4 w-4" />
                  List
                </Button>
              </div>
              <div className="text-sm text-gray-500">
                Showing {overlays.length} overlays
              </div>
            </div>
            <div className="relative w-64">
              <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
              <Input
                placeholder="Search overlays..."
                className="bg-white pl-9"
              />
            </div>
          </div>
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {overlays.map((overlay) => (
                <div
                  key={overlay.folderName}
                  className="overflow-hidden rounded-lg bg-white shadow-sm"
                >
                  <div className="relative">
                    <img
                      src={
                        overlay.image ||
                        "https://kzml8tdlacqptj5ggjfc.lite.vusercontent.net/placeholder.svg?height=200&width=350"
                      }
                      alt={overlay.displayName}
                      width={350}
                      height={200}
                      className="h-48 w-full object-cover"
                    />
                    {overlay.category && (
                      <Badge className="absolute top-3 right-3 bg-black/70">
                        {overlay.category}
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between">
                      <h3 className="font-bold">{overlay.displayName}</h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <SlidersHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Share2 className="mr-2 h-4 w-4" />
                            Share
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="mr-2 h-4 w-4" />
                            Export
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            <Trash2
                              className="mr-2 h-4 w-4"
                              color="var(--color-red-600)"
                            />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {overlay.description}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <Button size="sm">Preview</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {overlays.map((overlay) => (
                <div
                  key={overlay.folderName}
                  className="flex rounded-lg bg-white p-4 shadow-sm"
                >
                  <img
                    src={
                      overlay.image ||
                      "https://kzml8tdlacqptj5ggjfc.lite.vusercontent.net/placeholder.svg?height=200&width=350"
                    }
                    alt={overlay.displayName}
                    width={120}
                    height={80}
                    className="h-20 w-32 rounded object-cover"
                  />
                  <div className="ml-4 flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-bold">{overlay.displayName}</h3>
                        <p className="text-sm text-gray-500">
                          {overlay.description}
                        </p>
                      </div>
                      {overlay.category && <Badge>{overlay.category}</Badge>}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        {overlay.downloads && (
                          <div className="text-xs text-gray-500">
                            {overlay.downloads} downloads
                          </div>
                        )}
                        {overlay.rating && (
                          <div className="text-xs text-gray-500">
                            Rating: {overlay.rating}/5
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                        <Button size="sm">Preview</Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MyOverlaysRoute;
