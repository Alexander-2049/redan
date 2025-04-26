import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog";
import type { LayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";

interface DeleteLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  layout: LayoutDataAndFilename | null;
  onDelete: () => void;
}

export function DeleteLayoutDialog({
  isOpen,
  onOpenChange,
  layout,
  onDelete,
}: DeleteLayoutDialogProps) {
  if (!layout) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete the "{layout.data.name}" layout and all
            its overlays. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => onOpenChange(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-destructive hover:bg-destructive/90 text-white"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
