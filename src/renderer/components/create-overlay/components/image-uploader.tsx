import { Upload, X, AlertTriangle } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Label } from '../../ui/label';

interface ImageUploaderProps {
  value: string;
  onChange: (path: string) => void;
}

export const ImageUploader = ({ value, onChange }: ImageUploaderProps) => {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateImage = (file: File): string | null => {
    // Check file type
    if (!['image/png', 'image/jpeg', 'image/jpg', 'image/gif'].includes(file.type)) {
      return 'Only PNG, JPG, JPEG, and GIF files are allowed';
    }

    // Check file size (1MB = 1048576 bytes)
    if (file.size > 1048576) {
      return 'File size must be less than 1MB';
    }

    return null;
  };

  const handleFileSelect = (file: File) => {
    setError(null);

    const validationError = validateImage(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    // In Electron, you would get the full path
    // For demo purposes, we'll use the file name
    onChange(file.path || file.name);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: Event) => {
    const target = e.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleBrowse = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png,image/jpeg,image/jpg,image/gif';
    input.onchange = handleFileInput;
    input.click();
  };

  const handleRemove = () => {
    onChange('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      <Label>Preview Image</Label>

      {value ? (
        <div className="space-y-2">
          <div className="bg-muted/50 flex items-center justify-between rounded-lg border p-3">
            <span className="truncate font-mono text-sm">{value}</span>
            <Button onClick={handleRemove} size="sm" variant="ghost">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          className={`rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            dragOver ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
          }`}
          onDrop={handleDrop}
          onDragOver={e => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
        >
          <Upload className="text-muted-foreground mx-auto mb-2 h-8 w-8" />
          <p className="text-muted-foreground mb-2 text-sm">
            Drag and drop an image here, or click to browse
          </p>
          <Button onClick={handleBrowse} variant="outline" size="sm">
            Browse Files
          </Button>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertDescription>
          <strong>Image Requirements:</strong>
          <ul className="mt-1 list-inside list-disc space-y-1">
            <li>Maximum file size: 1MB</li>
            <li>Supported formats: PNG, JPG, JPEG, GIF</li>
            <li>Recommended size: 200x200px (1:1 aspect ratio)</li>
            <li>Steam won't render images larger than 200x200px effectively</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};
