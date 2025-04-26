import { Button } from "@/renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Textarea } from "@/renderer/components/ui/textarea";
import type { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";

interface EditLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  layout: LayoutDataAndFilename | null;
  onLayoutChange: (layout: LayoutDataAndFilename | null) => void;
  onSave: () => void;
}

export function EditLayoutDialog({
  isOpen,
  onOpenChange,
  layout,
  onLayoutChange,
  onSave,
}: EditLayoutDialogProps) {
  if (!layout) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Layout</DialogTitle>
          <DialogDescription>Update your layout information.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="edit-name" className="text-sm font-medium">
              Layout Name
            </label>
            <Input
              id="edit-name"
              value={layout.data.name}
              onChange={(e) =>
                onLayoutChange({
                  ...layout,
                  data: { ...layout.data, name: e.target.value },
                })
              }
              placeholder="Layout Name"
              maxLength={64}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="edit-description" className="text-sm font-medium">
              Description
            </label>
            <Textarea
              id="edit-description"
              value={layout.data.description}
              onChange={(e) =>
                onLayoutChange({
                  ...layout,
                  data: {
                    ...layout.data,
                    description: e.target.value,
                  },
                })
              }
              placeholder="Describe what this layout is for..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onSave}>Save Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
