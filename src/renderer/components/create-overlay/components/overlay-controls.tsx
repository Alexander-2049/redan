import { Play, Square, Edit, Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';

interface OverlayControlsProps {
  isOverlayOpen: boolean;
  editMode: boolean;
  isLoading: boolean;
  onOpenOverlay: () => void;
  onCloseOverlay: () => void;
  onToggleEditMode: () => void;
}

export const OverlayControls = ({
  isOverlayOpen,
  editMode,
  isLoading,
  onOpenOverlay,
  onCloseOverlay,
  onToggleEditMode,
}: OverlayControlsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button
          onClick={isOverlayOpen ? onCloseOverlay : onOpenOverlay}
          disabled={isLoading}
          size="lg"
          className="min-w-[150px]"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : isOverlayOpen ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Close Overlay
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Open Overlay
            </>
          )}
        </Button>

        <Button
          onClick={onToggleEditMode}
          disabled={!isOverlayOpen || isLoading}
          variant={editMode ? 'default' : 'outline'}
          size="lg"
          className="min-w-[150px]"
        >
          <Edit className="mr-2 h-4 w-4" />
          Edit Mode {editMode ? 'ON' : 'OFF'}
        </Button>
      </div>

      {!isOverlayOpen && (
        <Alert>
          <AlertDescription>
            Click "Open Overlay" to launch the overlay window and start testing your configuration.
          </AlertDescription>
        </Alert>
      )}

      {isOverlayOpen && !editMode && (
        <Alert>
          <AlertDescription>
            Enable "Edit Mode" to make the overlay draggable and resizable for positioning.
          </AlertDescription>
        </Alert>
      )}

      {isOverlayOpen && editMode && (
        <Alert>
          <AlertDescription>
            Edit Mode is active. The overlay window is now draggable and resizable.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
