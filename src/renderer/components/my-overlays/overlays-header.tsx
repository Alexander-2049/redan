import { Button } from "@/renderer/components/ui/button";
import { SlidersHorizontal } from "lucide-react";
import OpenOverlaysFolderButton from "@/renderer/components/open-overlays-folder-button";

export const OverlaysHeader = () => {
  return (
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h1 className="text-2xl font-bold">My Overlays</h1>
        <p className="text-gray-500">
          Manage and customize your racing overlays
        </p>
      </div>
      <div className="flex items-center gap-2">
        <OpenOverlaysFolderButton />
        <Button variant="outline" size="sm">
          <SlidersHorizontal className="mr-1 h-4 w-4" />
          Filter
        </Button>
      </div>
    </div>
  );
};
