import { Copy, Download } from 'lucide-react';
import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/renderer/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/renderer/components/ui/card';
import { Textarea } from '@/renderer/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/renderer/components/ui/tooltip';
import { generateReactHook, type Field } from '@/renderer/lib/generate-react-hook';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface HookGeneratorSectionProps {
  manifest: OverlayManifestFile;
}

export const HookGeneratorSection = ({ manifest }: HookGeneratorSectionProps) => {
  const [copyTooltipText, setCopyTooltipText] = useState('Copy to Clipboard');

  // Convert manifest fields to Field type for the generator
  const fields = useMemo<Field[]>(() => {
    const allFields = [...(manifest.requiredFields || []), ...(manifest.optionalFields || [])];

    return allFields.map(fieldName => {
      // For now, we'll assume all fields are numbers (you can enhance this later)
      // Optional fields are marked as optional
      const isOptional = (manifest.optionalFields || []).includes(fieldName);

      return {
        name: fieldName,
        type: 'number' as const,
        optional: isOptional,
      };
    });
  }, [manifest.requiredFields, manifest.optionalFields]);

  const generatedHook = useMemo(() => {
    if (fields.length === 0) {
      return '// Select fields in the Fields Configuration section above to generate a hook';
    }
    return generateReactHook(fields);
  }, [fields]);

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedHook);
      setCopyTooltipText('Copied!');
      toast.success('Hook copied to clipboard');
      setTimeout(() => setCopyTooltipText('Copy to Clipboard'), 2000);
    } catch (error) {
      toast.error('Copy Failed', {
        description: 'Failed to copy to clipboard. Please try again.',
      });
    }
  };

  const handleDownload = () => {
    const blob = new Blob([generatedHook], {
      type: 'text/typescript',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'use-game-data.tsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Generated React Hook</CardTitle>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="sm" onClick={void handleCopyToClipboard}>
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Hook
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{copyTooltipText}</p>
              </TooltipContent>
            </Tooltip>
            <Button size="sm" onClick={handleDownload} disabled={fields.length === 0}>
              <Download className="mr-2 h-4 w-4" />
              Download Hook
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Textarea
          value={generatedHook}
          readOnly
          className="min-h-[400px] font-mono text-sm"
          placeholder="Generated React hook will appear here..."
        />
      </CardContent>
    </Card>
  );
};
