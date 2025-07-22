import { Upload, ExternalLink, FolderOpen, Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Alert, AlertDescription } from '../../ui/alert';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

import { FilePathSelector } from './file-path-selector';
import OverlayPreview from './overlay-preview';

import { HTTP_SERVER_PORT } from '@/shared/constants';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';
import { UgcItemVisibility, UgcUpdate } from '@/shared/types/steam';

export const WorkshopUploadForm = () => {
  const [manifestPath, setManifestPath] = useState('');
  const [contentPath, setContentPath] = useState('');
  const [visibility, setVisibility] = useState<UgcItemVisibility>('Private');
  const [isUploading, setIsUploading] = useState(false);
  const [publishedItemId, setPublishedItemId] = useState<bigint | null>(null);
  const [manifestData, setManifestData] = useState<OverlayManifestFile | null>(null);
  const [previewUrl, setPreviewUrl] = useState<null | string>(null);
  const [thumbnailPath, setThumbnailPath] = useState<string | null>(null);

  useEffect(() => {
    setPreviewUrl(null);
    void window.overlay.servePreview(contentPath).then(isServed => {
      if (isServed) {
        setPreviewUrl(`http://localhost:${HTTP_SERVER_PORT}/preview?=${Math.random()}`);
      }
    });
  }, [contentPath]);

  useEffect(() => {
    if (!manifestData) return;

    setThumbnailPath(null);
    void window.overlay.screenshot().then(path => {
      if (path) {
        setThumbnailPath(path);
      } else {
        toast.error('Failed to generate screenshot');
      }
    });
  }, [manifestData]);

  const handleManifestPathSelect = async (path: string) => {
    setManifestPath(path);
    setContentPath(path.replace(/[^/\\]*$/, '')); // Get directory path

    try {
      const manifestContent = await window.fs.read(path);
      const parsedManifest = JSON.parse(manifestContent) as OverlayManifestFile;
      setManifestData(parsedManifest);
    } catch (error) {
      console.error('Failed to read manifest file:', error);
      toast.error('Invalid Manifest', {
        description:
          'Could not read or parse the manifest.json file. Please check the file format.',
      });
      setManifestData(null);
    }
  };

  const handleUpload = async () => {
    if (!manifestData) {
      toast.error('No Manifest', {
        description: 'Please select a valid manifest.json file first.',
      });
      return;
    }

    if (!thumbnailPath) {
      toast.error('No Thumbnail', {
        description: 'Please select a thumbnail image for your workshop item.',
      });
      return;
    }

    if (!thumbnailPath) {
      toast.error('No Screenshot', {
        description: 'Screenshot not ready yet. Please wait a moment and try again.',
      });
      return;
    }

    if (!window.steam?.workshop.create) {
      toast.error('Steam API Not Available', {
        description: 'Steam Workshop API is not available.',
      });
      return;
    }

    setIsUploading(true);

    try {
      const updateProps: UgcUpdate = {
        title: manifestData.title,
        description: manifestData.description || 'Overlay created with Overlay Configurator',
        tags: manifestData.tags,
        contentPath: contentPath,
        previewPath: thumbnailPath, // optionally: use screenshotPath instead
        changeNote: 'Initial upload',
      };

      const itemId = await window.steam.workshop.create(updateProps, visibility);

      if (itemId) {
        setPublishedItemId(itemId);
        toast.success('Upload Successful!', {
          description: `Your overlay "${manifestData.title}" has been uploaded to Steam Workshop.`,
        });
      } else {
        throw new Error('Steam returned null item ID');
      }
    } catch (error) {
      console.error('Upload failed:', error);
      toast.error('Upload Failed', {
        description: error instanceof Error ? error.message : 'Failed to upload to Steam Workshop',
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleViewInSteam = () => {
    if (publishedItemId && window.steam?.workshop.openInSteamClient) {
      window.steam.workshop.openInSteamClient(publishedItemId);
    }
  };

  const canUpload = manifestData && thumbnailPath && thumbnailPath && !isUploading;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Overlay to Workshop</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Manifest File Selection */}
        <div className="space-y-4">
          <FilePathSelector
            label="Manifest File (manifest.json)"
            value={manifestPath}
            onPathSelect={path => {
              void handleManifestPathSelect(path);
            }}
            accept=".json"
            icon={<FolderOpen className="h-4 w-4" />}
          />

          {contentPath && (
            <Alert>
              <AlertDescription>
                Content folder: <code className="font-mono text-sm">{contentPath}</code>
              </AlertDescription>
            </Alert>
          )}
        </div>

        {previewUrl && (
          <div
            style={{ width: '100%', height: '450px' }}
            className="flex items-center justify-center"
          >
            <OverlayPreview
              iframeUrl={previewUrl}
              backgroundImageUrl={`http://localhost:${HTTP_SERVER_PORT}/assets/images/738c2f57-adad-4978-898c-0ac778680d9b.jpg`}
              defaultHeight={450}
              defaultWidth={600}
              parentHeight={450}
            />
          </div>
        )}

        {/* Manifest Preview */}
        {manifestData && (
          <Card className="bg-muted/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Manifest Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label className="text-sm font-medium">Title</Label>
                <p className="text-sm">{manifestData.title || 'No title specified'}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-muted-foreground text-sm">
                  {manifestData.description || 'No description specified'}
                </p>
              </div>

              {manifestData.tags.length > 0 && (
                <div>
                  <Label className="text-sm font-medium">Tags</Label>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {manifestData.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <Label className="text-sm font-medium">Default Size</Label>
                  <p className="text-muted-foreground">
                    {manifestData.dimentions.defaultWidth}×{manifestData.dimentions.defaultHeight}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Settings</Label>
                  <p className="text-muted-foreground">{manifestData.settings.length} configured</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Visibility Selection */}
        <div className="space-y-2">
          <Label htmlFor="visibility">Visibility</Label>
          <Select
            value={visibility}
            onValueChange={(value: UgcItemVisibility) => setVisibility(value)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Public">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  Public - Visible to everyone
                </div>
              </SelectItem>
              <SelectItem value="Private">
                <div className="flex items-center gap-2">
                  <EyeOff className="h-4 w-4" />
                  Private - Only visible to you
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-muted-foreground text-xs">
            You can change the visibility later in Steam Workshop if needed.
          </p>
        </div>

        {/* Upload Actions */}
        <div className="flex items-center justify-between border-t pt-4">
          <div className="text-muted-foreground text-sm">
            {publishedItemId ? (
              <span className="font-medium text-green-600">
                ✓ Successfully uploaded to Steam Workshop
              </span>
            ) : (
              <span>Ready to upload when all fields are completed</span>
            )}
          </div>

          <div className="flex gap-2">
            {publishedItemId ? (
              <Button onClick={handleViewInSteam} variant="default">
                <ExternalLink className="mr-2 h-4 w-4" />
                View in Steam Workshop
              </Button>
            ) : (
              <Button
                onClick={() => {
                  void handleUpload();
                }}
                disabled={!canUpload}
              >
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-pulse" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload to Workshop
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Upload Requirements */}
        {!publishedItemId && (
          <Alert>
            <AlertDescription>
              <strong>Before uploading:</strong>
              <ul className="mt-2 list-inside list-disc space-y-1 text-sm">
                <li>Select your manifest.json file</li>
                <li>Choose a thumbnail image (max 1MB, preferably 200×200px)</li>
                <li>Choose visibility (Public or Private)</li>
                <li>Make sure your overlay files are in the same folder as manifest.json</li>
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
