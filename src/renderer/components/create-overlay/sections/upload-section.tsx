import { Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Card, CardHeader, CardTitle } from '../../ui/card';
import { WorkshopUploadForm } from '../components/workshop-upload-form';

export const UploadSection = () => {
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  // Check Steam online status
  useEffect(() => {
    const checkSteamStatus = async () => {
      try {
        if (window.steam?.isOnline) {
          const online = await window.steam.isOnline();
          setIsOnline(online);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        console.error('Failed to check Steam status:', error);
        setIsOnline(false);
      }
    };

    void checkSteamStatus();
  }, []);

  if (isOnline === null) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Checking Steam connection...</span>
      </div>
    );
  }

  if (!isOnline) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          Steam is not online or not available. Please make sure Steam is running and you are logged
          in to upload workshop items.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Steam Workshop Upload</CardTitle>
          <p className="text-muted-foreground text-sm">
            Upload your overlay to Steam Workshop. Title, description, and tags will be
            automatically taken from your manifest.json file.
          </p>
        </CardHeader>
      </Card>

      {/* Upload Form */}
      <WorkshopUploadForm />
    </div>
  );
};
