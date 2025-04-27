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
import {
  Download,
  Edit,
  Share2,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";

interface OverlayCardProps {
  overlay: IOverlayAndFolderName;
  layouts: LayoutDataAndFilename[];
  onAddToLayout: (layoutFileName: string, overlayFolderName: string) => void;
}

export const OverlayCard = ({
  overlay,
  layouts,
  onAddToLayout,
}: OverlayCardProps) => {
  const sortedLayouts = layouts.sort((a, b) => {
    // Sort active layouts to the top
    if (a.data.active && !b.data.active) return -1;
    if (!a.data.active && b.data.active) return 1;
    return 0;
  });

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-sm">
      <div className="relative">
        <img
          src={
            overlay.data.image ||
            "https://kzml8tdlacqptj5ggjfc.lite.vusercontent.net/placeholder.svg?height=200&width=350" ||
            "/placeholder.svg"
          }
          alt={overlay.data.name}
          width={350}
          height={200}
          className="h-48 w-full object-cover"
        />
        {overlay.data.type && (
          <Badge className="absolute top-3 right-3 bg-black/70">
            {overlay.data.type}
          </Badge>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-bold">{overlay.data.name}</h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
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
                <Trash2 className="mr-2 h-4 w-4" color="var(--color-red-600)" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="mt-1 text-sm text-gray-500">{overlay.data.description}</p>
        <div className="mt-4 flex items-center justify-between">
          <Button size="sm">Preview</Button>
          <LayoutDropdown
            layouts={sortedLayouts}
            overlayFolderName={overlay.folderName}
            onAddToLayout={onAddToLayout}
          />
        </div>
      </div>
    </div>
  );
};

interface LayoutDropdownProps {
  layouts: LayoutDataAndFilename[];
  overlayFolderName: string;
  onAddToLayout: (layoutFileName: string, overlayFolderName: string) => void;
}

const LayoutDropdown = ({
  layouts,
  overlayFolderName,
  onAddToLayout,
}: LayoutDropdownProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline">
          <span className="mr-1">+</span> Add to Layout
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {layouts.map((layout) => (
          <DropdownMenuItem
            key={layout.filename}
            onClick={() => onAddToLayout(layout.filename, overlayFolderName)}
            className={layout.data.active ? "font-medium" : ""}
          >
            {layout.data.name}
            {layout.data.active && (
              <Badge variant="outline" className="bg-primary/5 ml-2 text-xs">
                Active
              </Badge>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
