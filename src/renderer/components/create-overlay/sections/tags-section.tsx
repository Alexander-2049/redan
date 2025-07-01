import { X } from 'lucide-react';

import { PREDEFINED_TAGS } from '../../../constants/tags';

import { Badge } from '@/renderer/components/ui/badge';
import { Button } from '@/renderer/components/ui/button';
import { Input } from '@/renderer/components/ui/input';
import { Label } from '@/renderer/components/ui/label';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface TagsSectionProps {
  manifest: OverlayManifestFile;
  onUpdate: (updates: Partial<OverlayManifestFile>) => void;
  newTag: string;
  setNewTag: (tag: string) => void;
}

export const TagsSection = ({ manifest, onUpdate, newTag, setNewTag }: TagsSectionProps) => {
  const addTag = (tag: string) => {
    if (tag && !manifest.tags.includes(tag)) {
      onUpdate({ tags: [...manifest.tags, tag] });
    }
    setNewTag('');
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate({ tags: manifest.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="space-y-2">
      <Label>Tags</Label>
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {PREDEFINED_TAGS.map(tag => (
            <Badge
              key={tag}
              variant={manifest.tags.includes(tag) ? 'default' : 'outline'}
              className="cursor-pointer"
              onClick={() => (manifest.tags.includes(tag) ? removeTag(tag) : addTag(tag))}
            >
              {tag}
              {manifest.tags.includes(tag) && <X className="ml-1 h-3 w-3" />}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Input
            value={newTag}
            onChange={e => setNewTag(e.target.value)}
            placeholder="Add custom tag"
            onKeyPress={e => e.key === 'Enter' && addTag(newTag)}
          />
          <Button onClick={() => addTag(newTag)} disabled={!newTag}>
            Add
          </Button>
        </div>
        {manifest.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-muted-foreground text-sm">Selected:</span>
            {manifest.tags.map(tag => (
              <Badge
                key={tag}
                variant="secondary"
                className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer transition-colors"
                onClick={() => removeTag(tag)}
              >
                {tag}
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
