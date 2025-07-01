import { Copy, Download } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/renderer/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/renderer/components/ui/card';
import { Textarea } from '@/renderer/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/renderer/components/ui/tooltip';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface JsonPreviewSectionProps {
  manifest: OverlayManifestFile;
}

export const JsonPreviewSection = ({ manifest }: JsonPreviewSectionProps) => {
  const [copyTooltipText, setCopyTooltipText] = useState('Copy to Clipboard');

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(manifest, null, 2));
      setCopyTooltipText('Copied!');
      setTimeout(() => setCopyTooltipText('Copy to Clipboard'), 2000);
    } catch (error) {
      toast.error('Copy Failed', {
        description: 'Failed to copy to clipboard. Please try again.',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([JSON.stringify(manifest, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manifest Preview</CardTitle>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={void handleCopyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy to Clipboard
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copyTooltipText}</p>
              </TooltipContent>
            </Tooltip>
            <Button size="sm" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download Manifest
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={JSON.stringify(manifest, null, 2)}
          readOnly
          className="min-h-[300px] font-mono text-sm"
          placeholder="Manifest JSON will appear here..."
        />
      </CardContent>
    </Card>
  );
};
