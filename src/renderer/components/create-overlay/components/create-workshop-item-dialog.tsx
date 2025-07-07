import { AlertTriangle } from 'lucide-react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../ui/dialog';

interface CreateWorkshopItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export const CreateWorkshopItemDialog = ({
  isOpen,
  onClose,
  onConfirm,
}: CreateWorkshopItemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Workshop Item</DialogTitle>
          <DialogDescription>
            This will create a new Steam Workshop item that you can then edit and upload content to.
          </DialogDescription>
        </DialogHeader>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Steam requires you to create the workshop page first before
            you can upload content. After creation, you'll be able to edit the item details and
            upload your overlay files.
          </AlertDescription>
        </Alert>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              void onConfirm();
            }}
          >
            Create Workshop Item
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
