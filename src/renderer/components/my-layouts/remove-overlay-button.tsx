import { Trash2 } from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/renderer/components/ui/alert-dialog";

interface RemoveOverlayButtonProps {
  overlayName: string;
  onRemove: () => void;
  variant?: "default" | "ghost";
}

export function RemoveOverlayButton({
  overlayName,
  onRemove,
  variant = "ghost",
}: RemoveOverlayButtonProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant={variant}
          size="sm"
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 size={14} className="mr-1" />
          Remove
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove overlay?</AlertDialogTitle>
          <AlertDialogDescription>
            This will remove the "{overlayName}" overlay from this layout.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onRemove}
            className="bg-destructive hover:bg-destructive/90"
          >
            Remove
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
