import { Badge } from "@/renderer/components/ui/badge";
import { Button } from "@/renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/renderer/components/ui/dropdown-menu";
import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import type { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";

interface OverlayListItemProps {
  overlay: IOverlayAndFolderName;
  layouts: LayoutDataAndFilename[];
  onAddToLayout: (layoutFileName: string, overlayFolderName: string) => void;
}

export const OverlayListItem = ({
  overlay,
  layouts,
  onAddToLayout,
}: OverlayListItemProps) => {
  const sortedLayouts = layouts.sort((a, b) => {
    // Sort active layouts to the top
    if (a.data.active && !b.data.active) return -1;
    if (!a.data.active && b.data.active) return 1;
    return 0;
  });

  return (
    <div className="flex rounded-lg bg-white p-4 shadow-sm">
      <img
        src={
          overlay.data.image ||
          "https://kzml8tdlacqptj5ggjfc.lite.vusercontent.net/placeholder.svg?height=200&width=350" ||
          "/placeholder.svg"
        }
        alt={overlay.data.name}
        width={120}
        height={80}
        className="h-20 w-32 rounded object-cover"
      />
      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-bold">{overlay.data.name}</h3>
            <p className="text-sm text-gray-500">{overlay.data.description}</p>
          </div>
          {overlay.data.type && <Badge>{overlay.data.type}</Badge>}
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="flex gap-2">
            <Button size="sm" variant="outline">
              Edit
            </Button>
            <Button size="sm">Preview</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size="sm" variant="outline">
                  <span className="mr-1">+</span> Add to Layout
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {sortedLayouts.map((layout) => (
                  <DropdownMenuItem
                    key={layout.filename}
                    onClick={() =>
                      onAddToLayout(layout.filename, overlay.folderName)
                    }
                    className={
                      layout.data.active ? "bg-primary/10 font-medium" : ""
                    }
                  >
                    {layout.data.name}
                    {layout.data.active && (
                      <Badge
                        variant="outline"
                        className="bg-primary/20 ml-2 text-xs"
                      >
                        Active
                      </Badge>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
};
