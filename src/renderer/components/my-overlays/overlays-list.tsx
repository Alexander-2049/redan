import type { IOverlayAndFolderName } from "@/shared/types/IOverlayAndFolderName";
import type { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import { OverlayListItem } from "./overlay-list-item";

interface OverlaysListProps {
  overlays: IOverlayAndFolderName[];
  layouts: LayoutDataAndFilename[];
  onAddToLayout: (layoutFileName: string, overlayFolderName: string) => void;
}

export const OverlaysList = ({
  overlays,
  layouts,
  onAddToLayout,
}: OverlaysListProps) => {
  return (
    <div className="space-y-4">
      {overlays.map((overlay) => (
        <OverlayListItem
          key={overlay.folderName}
          overlay={overlay}
          layouts={layouts}
          onAddToLayout={onAddToLayout}
        />
      ))}
    </div>
  );
};
