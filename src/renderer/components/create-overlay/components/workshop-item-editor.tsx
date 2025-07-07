'use client';

import { Save, Upload, FolderOpen } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../../ui/dialog';
import { Input } from '../../ui/input';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Textarea } from '../../ui/textarea';

import { FilePathSelector } from './file-path-selector';
import { ImageUploader } from './image-uploader';

import { UgcItemVisibility, UgcUpdate, WorkshopItem } from '@/shared/types/steam';

interface WorkshopItemEditorProps {
  item: WorkshopItem;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: WorkshopItem, updates: UgcUpdate) => Promise<void>;
}

export const WorkshopItemEditor = ({ item, isOpen, onClose, onSave }: WorkshopItemEditorProps) => {
  const [formData, setFormData] = useState({
    title: item.title,
    description: item.description,
    visibility: item.visibility,
    tags: [...item.tags],
    changeNote: '',
    manifestPath: '',
    contentPath: '',
    previewPath: '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({
        title: item.title,
        description: item.description,
        visibility: item.visibility,
        tags: [...item.tags],
        changeNote: '',
        manifestPath: '',
        contentPath: '',
        previewPath: '',
      });
    }
  }, [item, isOpen]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Only include changed fields
      const updates: UgcUpdate = {};

      if (formData.title !== item.title) updates.title = formData.title;
      if (formData.description !== item.description) updates.description = formData.description;
      if (formData.changeNote) updates.changeNote = formData.changeNote;
      if (formData.contentPath) updates.contentPath = formData.contentPath;
      if (formData.previewPath) updates.previewPath = formData.previewPath;
      if (JSON.stringify(formData.tags) !== JSON.stringify(item.tags)) updates.tags = formData.tags;

      await onSave(item, updates);
      onClose();
    } catch (error) {
      console.error('Failed to save workshop item:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleManifestPathSelect = (path: string) => {
    setFormData(prev => ({
      ...prev,
      manifestPath: path,
      contentPath: path.replace(/[^/\\]*$/, ''), // Get directory path
    }));
  };

  const addTag = () => {
    if (newTag && !formData.tags.includes(newTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag],
      }));
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Workshop Item</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="visibility">Visibility</Label>
              <Select
                value={formData.visibility}
                onValueChange={(value: UgcItemVisibility) =>
                  setFormData(prev => ({ ...prev, visibility: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Public">Public</SelectItem>
                  <SelectItem value="FriendsOnly">Friends Only</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                  <SelectItem value="Unlisted">Unlisted</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="changeNote">Change Note (Optional)</Label>
              <Textarea
                id="changeNote"
                value={formData.changeNote}
                onChange={e => setFormData(prev => ({ ...prev, changeNote: e.target.value }))}
                placeholder="Describe what changed in this update..."
                rows={2}
              />
            </div>
          </div>

          {/* File Paths */}
          <div className="space-y-4">
            <h3 className="font-medium">Content Files</h3>

            <FilePathSelector
              label="Manifest File (manifest.json)"
              value={formData.manifestPath}
              onPathSelect={handleManifestPathSelect}
              accept=".json"
              icon={<FolderOpen className="h-4 w-4" />}
            />

            {formData.contentPath && (
              <Alert>
                <AlertDescription>
                  Content folder: <code className="font-mono">{formData.contentPath}</code>
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Preview Image */}
          <div className="space-y-4">
            <h3 className="font-medium">Preview Image</h3>
            <ImageUploader
              value={formData.previewPath}
              onChange={path => setFormData(prev => ({ ...prev, previewPath: path }))}
            />
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <h3 className="font-medium">Tags</h3>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={e => setNewTag(e.target.value)}
                placeholder="Add tag"
                onKeyPress={e => e.key === 'Enter' && addTag()}
              />
              <Button onClick={addTag} disabled={!newTag}>
                Add
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="hover:bg-destructive hover:text-destructive-foreground cursor-pointer"
                    onClick={() => removeTag(tag)}
                  >
                    {tag} ×
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={void handleSave} disabled={isSaving}>
            {isSaving ? (
              <>
                <Upload className="mr-2 h-4 w-4 animate-pulse" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
