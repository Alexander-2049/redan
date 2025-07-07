import { Edit, ExternalLink, Loader2 } from 'lucide-react';
import { useState } from 'react';

import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';

import { WorkshopItemEditor } from './workshop-item-editor';

import { UgcUpdate, WorkshopItem } from '@/shared/types/steam';

interface WorkshopItemsListProps {
  items: WorkshopItem[];
  isLoading: boolean;
  onUpdateItem: (item: WorkshopItem, updates: UgcUpdate) => Promise<void>;
}

export const WorkshopItemsList = ({ items, isLoading, onUpdateItem }: WorkshopItemsListProps) => {
  const [editingItem, setEditingItem] = useState<WorkshopItem | null>(null);

  const handleOpenInSteam = (workshopId: bigint) => {
    if (window.steam?.workshop.openInSteamClient) {
      window.steam.workshop.openInSteamClient(workshopId);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getVisibilityColor = (visibility: string) => {
    switch (visibility) {
      case 'Public':
        return 'bg-green-100 text-green-800';
      case 'Private':
        return 'bg-red-100 text-red-800';
      case 'FriendsOnly':
        return 'bg-blue-100 text-blue-800';
      case 'Unlisted':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading workshop items...</span>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-muted-foreground py-12 text-center">
        <p>No workshop items found.</p>
        <p className="text-sm">Create your first workshop item to get started.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {items.map(item => (
          <div key={item.publishedFileId.toString()} className="rounded-lg border p-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="font-medium">{item.title}</h3>
                  <Badge className={getVisibilityColor(item.visibility)}>{item.visibility}</Badge>
                  {item.banned && <Badge variant="destructive">Banned</Badge>}
                </div>

                <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                  {item.description}
                </p>

                <div className="text-muted-foreground flex items-center gap-4 text-xs">
                  <span>Created: {formatDate(item.timeCreated)}</span>
                  <span>Updated: {formatDate(item.timeUpdated)}</span>
                  <span>👍 {item.numUpvotes}</span>
                  <span>👎 {item.numDownvotes}</span>
                  {typeof item.statistics.numSubscriptions !== 'undefined' &&
                    item.statistics.numSubscriptions > BigInt(0) && (
                      <span>📥 {item.statistics.numSubscriptions.toString()}</span>
                    )}
                </div>

                {item.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="ml-4 flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setEditingItem(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleOpenInSteam(item.publishedFileId)}
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {item.previewUrl && (
              <div className="mt-3">
                <img
                  src={item.previewUrl || '/placeholder.svg'}
                  alt={`${item.title} preview`}
                  className="h-20 w-20 rounded border object-cover"
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {editingItem && (
        <WorkshopItemEditor
          item={editingItem}
          isOpen={!!editingItem}
          onClose={() => setEditingItem(null)}
          onSave={onUpdateItem}
        />
      )}
    </>
  );
};
