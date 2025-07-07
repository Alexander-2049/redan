import { Plus, RefreshCw, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { CreateWorkshopItemDialog } from '../components/create-workshop-item-dialog';
import { WorkshopItemsList } from '../components/workshop-items-list';
import { useWorkshopItems } from '../hooks/use-workshop-items';

import { UgcUpdate, WorkshopItem } from '@/shared/types/steam';

export const UploadSection = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean | null>(null);

  const { items, isLoading, error, refreshItems, createItem, updateItem } = useWorkshopItems();

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

  const handleCreateItem = async () => {
    const success = await createItem();
    if (success) {
      setIsCreateDialogOpen(false);
      await refreshItems();
    }
  };

  const handleUpdateItem = async (item: WorkshopItem, updates: UgcUpdate) => {
    await updateItem(item.publishedFileId, updates);
    await refreshItems();
  };

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
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Steam Workshop Upload</CardTitle>
              <p className="text-muted-foreground mt-1 text-sm">
                Manage your overlay uploads to Steam Workshop
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  void refreshItems();
                }}
                variant="outline"
                disabled={isLoading}
              >
                <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create New Item
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Workshop Items List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Workshop Items</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <WorkshopItemsList items={items} isLoading={isLoading} onUpdateItem={handleUpdateItem} />
        </CardContent>
      </Card>

      {/* Create Item Dialog */}
      <CreateWorkshopItemDialog
        isOpen={isCreateDialogOpen}
        onClose={() => setIsCreateDialogOpen(false)}
        onConfirm={handleCreateItem}
      />
    </div>
  );
};
