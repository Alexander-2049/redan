import { AlertTriangle } from 'lucide-react';

import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  settingName: string;
}

export const ConfirmDeleteDialog = ({
  isOpen,
  onClose,
  onConfirm,
  settingName,
}: ConfirmDeleteDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-destructive h-5 w-5" />
            <DialogTitle>Delete Setting</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to delete the setting "{settingName}"? This action cannot be
            undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Delete Setting
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
