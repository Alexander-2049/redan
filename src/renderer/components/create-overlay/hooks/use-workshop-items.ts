import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

import { UgcUpdate, WorkshopItem } from '@/shared/types/steam';

export const useWorkshopItems = () => {
  const [items, setItems] = useState<WorkshopItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshItems = useCallback(async () => {
    if (!window.steam?.workshop.getMyItems) {
      setError('Steam Workshop API not available');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await window.steam.workshop.getMyItems(1);
      if (result) {
        const validItems = result.items.filter((item): item is WorkshopItem => item != null);
        setItems(validItems);
      } else {
        setItems([]);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load workshop items';
      setError(errorMessage);
      toast.error('Failed to Load Items', {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createItem = useCallback(async (): Promise<boolean> => {
    if (!window.steam?.workshop.create) {
      toast.error('Steam Workshop API not available');
      return false;
    }

    try {
      const itemId = await window.steam.workshop.create();
      if (itemId) {
        toast.success('Workshop Item Created', {
          description: 'Your new workshop item has been created successfully.',
        });
        return true;
      } else {
        toast.error('Failed to Create Item', {
          description: 'Steam returned an error when creating the workshop item.',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create workshop item';
      toast.error('Creation Failed', {
        description: errorMessage,
      });
      return false;
    }
  }, []);

  const updateItem = useCallback(async (itemId: bigint, updates: UgcUpdate): Promise<boolean> => {
    if (!window.steam?.workshop.updateItem) {
      toast.error('Steam Workshop API not available');
      return false;
    }

    try {
      const result = await window.steam.workshop.updateItem(itemId, updates);
      if (result) {
        toast.success('Item Updated', {
          description: 'Your workshop item has been updated successfully.',
        });
        return true;
      } else {
        toast.error('Update Failed', {
          description: 'Steam returned an error when updating the workshop item.',
        });
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update workshop item';
      toast.error('Update Failed', {
        description: errorMessage,
      });
      return false;
    }
  }, []);

  // Load items on mount
  useEffect(() => {
    void refreshItems();
  }, [refreshItems]);

  return {
    items,
    isLoading,
    error,
    refreshItems,
    createItem,
    updateItem,
  };
};
