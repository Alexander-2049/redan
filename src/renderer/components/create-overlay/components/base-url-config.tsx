import { Globe, HelpCircle } from 'lucide-react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../ui/tooltip';

interface BaseUrlConfigProps {
  baseUrl: string;
  onBaseUrlChange: (url: string) => void;
  disabled?: boolean;
}

export const BaseUrlConfig = ({
  baseUrl,
  onBaseUrlChange,
  disabled = false,
}: BaseUrlConfigProps) => {
  const validateUrl = (url: string): boolean => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    onBaseUrlChange(value);
  };

  const isValidUrl = validateUrl(baseUrl);

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

      <div className="flex items-center gap-2">
        <Globe className="text-muted-foreground h-4 w-4 flex-shrink-0" />
        <Input
          id="baseUrl"
          value={baseUrl}
          onChange={e => handleUrlChange(e.target.value)}
          placeholder="http://localhost:3000"
          className={!isValidUrl ? 'border-red-500' : ''}
          disabled={disabled}
        />
      </div>

      {!isValidUrl && (
        <Alert variant="destructive">
          <AlertDescription>
            Please enter a valid URL (e.g., http://localhost:3000)
          </AlertDescription>
        </Alert>
      )}

      {disabled && (
        <Alert>
          <AlertDescription>
            Base URL cannot be changed while the overlay is open. Close the overlay to modify the
            URL.
          </AlertDescription>
        </Alert>
      )}

      {!disabled && (
        <Alert>
          <AlertDescription>
            Make sure your overlay development server is running on this URL before opening the
            overlay.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
