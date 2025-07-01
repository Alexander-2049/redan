import { HelpCircle } from 'lucide-react';

import { Input } from '@/renderer/components/ui/input';
import { Label } from '@/renderer/components/ui/label';
import { Textarea } from '@/renderer/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/renderer/components/ui/tooltip';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface BasicInfoSectionProps {
  manifest: OverlayManifestFile;
  onUpdate: (updates: Partial<OverlayManifestFile>) => void;
}

export const BasicInfoSection = ({ manifest, onUpdate }: BasicInfoSectionProps) => {
  return (
    <>
      {/* Title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="title">Title</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Will be used both for Steam Workshop and overlays list</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Input
          id="title"
          value={manifest.title}
          onChange={e => onUpdate({ title: e.target.value })}
          placeholder="Enter overlay title"
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="description">Description</Label>
          <Tooltip>
            <TooltipTrigger>
              <HelpCircle className="text-muted-foreground h-4 w-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Will be available on Steam Workshop item page</p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Textarea
          id="description"
          value={manifest.description || ''}
          onChange={e => onUpdate({ description: e.target.value })}
          placeholder="Enter overlay description"
          rows={3}
        />
      </div>
    </>
  );
};
