import type React from 'react';
import { useState } from 'react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';

interface FilePathSelectorProps {
  label: string;
  value: string;
  onPathSelect: (path: string) => void;
  accept?: string;
  icon?: React.ReactNode;
}

export const FilePathSelector = ({
  label,
  value,
  onPathSelect,
  accept,
  icon,
}: FilePathSelectorProps) => {
  const [isSelecting, setIsSelecting] = useState(false);

  const handleSelectFile = () => {
    setIsSelecting(true);
    try {
      // In Electron, you would use dialog.showOpenDialog
      // For now, we'll simulate with a file input
      const input = document.createElement('input');
      input.type = 'file';
      if (accept) input.accept = accept;

      input.onchange = e => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          // In Electron, you would get the full path
          // For demo purposes, we'll use the file name
          onPathSelect(file.path || file.name);
        }
      };

      input.click();
    } catch (error) {
      console.error('Failed to select file:', error);
    } finally {
      setIsSelecting(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={value} readOnly placeholder="No file selected" className="flex-1" />
        <Button onClick={void handleSelectFile} disabled={isSelecting} variant="outline">
          {icon}
          {isSelecting ? 'Selecting...' : 'Browse'}
        </Button>
      </div>
      {accept === '.json' && (
        <Alert>
          <AlertDescription>
            Select your manifest.json file. The content folder will be automatically set to the
            folder containing this file.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
