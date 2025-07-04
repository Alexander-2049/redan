import { Globe, Check, X, HelpCircle } from 'lucide-react';
import { useState } from 'react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

interface BaseUrlConfigProps {
  baseUrl: string;
  onBaseUrlChange: (url: string) => void;
}

export const BaseUrlConfig = ({ baseUrl, onBaseUrlChange }: BaseUrlConfigProps) => {
  const [tempUrl, setTempUrl] = useState(baseUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [isValidUrl, setIsValidUrl] = useState(true);

  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setTempUrl(value);
    setIsValidUrl(validateUrl(value));
  };

  const handleSave = () => {
    if (isValidUrl && tempUrl !== baseUrl) {
      onBaseUrlChange(tempUrl);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempUrl(baseUrl);
    setIsValidUrl(true);
    setIsEditing(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Label htmlFor="baseUrl">Overlay Base URL</Label>
        <Tooltip>
          <TooltipTrigger>
            <HelpCircle className="text-muted-foreground h-4 w-4" />
          </TooltipTrigger>
          <TooltipContent>
            <p>The base URL where your overlay development server is running</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {isEditing ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="text-muted-foreground h-4 w-4 flex-shrink-0" />
            <Input
              id="baseUrl"
              value={tempUrl}
              onChange={e => handleUrlChange(e.target.value)}
              placeholder="http://localhost:3000"
              className={!isValidUrl ? 'border-red-500' : ''}
            />
            <Button onClick={handleSave} disabled={!isValidUrl} size="sm" variant="default">
              <Check className="h-4 w-4" />
            </Button>
            <Button onClick={handleCancel} size="sm" variant="outline">
              <X className="h-4 w-4" />
            </Button>
          </div>
          {!isValidUrl && (
            <Alert variant="destructive">
              <AlertDescription>
                Please enter a valid URL (e.g., http://localhost:3000)
              </AlertDescription>
            </Alert>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Globe className="text-muted-foreground h-4 w-4 flex-shrink-0" />
          <code className="bg-muted flex-1 rounded-md px-3 py-2 font-mono text-sm">{baseUrl}</code>
          <Button onClick={handleEdit} size="sm" variant="outline">
            Edit
          </Button>
        </div>
      )}

      <Alert>
        <AlertDescription>
          Make sure your overlay development server is running on this URL before opening the
          overlay.
        </AlertDescription>
      </Alert>
    </div>
  );
};
