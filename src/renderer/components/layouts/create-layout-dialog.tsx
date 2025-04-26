import { Button } from "@/renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/renderer/components/ui/dialog";
import { Input } from "@/renderer/components/ui/input";
import { Textarea } from "@/renderer/components/ui/textarea";
import { Plus } from "lucide-react";

interface CreateLayoutDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  layoutName: string;
  layoutDescription: string;
  onLayoutNameChange: (name: string) => void;
  onLayoutDescriptionChange: (description: string) => void;
  onClose: () => void;
  onCreate: () => void;
}

export function CreateLayoutDialog({
  isOpen,
  onOpenChange,
  layoutName,
  layoutDescription,
  onLayoutNameChange,
  onLayoutDescriptionChange,
  onClose,
  onCreate,
}: CreateLayoutDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          Create New Layout
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Layout</DialogTitle>
          <DialogDescription>
            Create a new layout to organize your stream overlays.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <label htmlFor="name" className="text-sm font-medium">
              Layout Name
            </label>
            <Input
              id="name"
              value={layoutName}
              onChange={(e) => onLayoutNameChange(e.target.value)}
              placeholder="My Stream Layout"
              maxLength={64}
            />
          </div>
          <div className="grid gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description (optional)
            </label>
            <Textarea
              id="description"
              value={layoutDescription}
              onChange={(e) => onLayoutDescriptionChange(e.target.value)}
              placeholder="Describe what this layout is for..."
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onCreate}>Create Layout</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
