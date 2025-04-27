import { Button } from "@/renderer/components/ui/button";
import { Input } from "@/renderer/components/ui/input";
import { LayoutGrid, List, Search } from "lucide-react";

interface OverlaysToolbarProps {
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  overlayCount: number;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const OverlaysToolbar = ({
  viewMode,
  setViewMode,
  overlayCount,
  searchQuery,
  setSearchQuery,
}: OverlaysToolbarProps) => {
  return (
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
          Showing {overlayCount} overlays
        </div>
      </div>
      <div className="relative w-64">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          placeholder="Search overlays..."
          className="bg-white pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
    </div>
  );
};
