import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import type { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import { OverlayCard } from "./overlay-card";

interface OverlaysGridProps {
  overlays: IOverlayAndFolderName[];
  layouts: LayoutDataAndFilename[];
  onAddToLayout: (layoutFileName: string, overlayFolderName: string) => void;
}

export const OverlaysGrid = ({
  overlays,
  layouts,
  onAddToLayout,
}: OverlaysGridProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {overlays.map((overlay) => (
        <OverlayCard
          key={overlay.folderName}
          overlay={overlay}
          layouts={layouts}
          onAddToLayout={onAddToLayout}
        />
      ))}
    </div>
  );
};
