import { useEffect, useState } from 'react';

import { RunTestSection } from '../components/create-overlay/sections/run-test-section';
import { UploadSection } from '../components/create-overlay/sections/upload-section';
import { getCookie, setCookie } from '../components/create-overlay/utils/cookies-utils';

import CreateOverlayConfigureTab from '@/renderer/components/create-overlay/create-overlay-configure-tab';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/renderer/components/ui/tabs';
import { overlayManifestFileSchema } from '@/shared/schemas/overlayManifestFileSchema';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

const MANIFEST_COOKIE_KEY = 'configurator:manifest.json';

const CreateOverlayRoute = () => {
  const [manifest, setManifest] = useState<OverlayManifestFile>(() => {
    const savedManifest = getCookie(MANIFEST_COOKIE_KEY);
    if (savedManifest) {
      try {
        const parsed = overlayManifestFileSchema.parse(JSON.parse(savedManifest));
        return parsed;
      } catch (error) {
        //
      }
    }

    return {
      title: '',
      description: '',
      tags: [],
      dimentions: {
        defaultWidth: 300,
        defaultHeight: 200,
        minWidth: 100,
        minHeight: 100,
        maxWidth: 800,
        maxHeight: 600,
      },
      pages: [],
      requiredFields: [],
      optionalFields: [],
    };
  });

  useEffect(() => {
    setCookie(MANIFEST_COOKIE_KEY, JSON.stringify(manifest), 30);
  }, [manifest]);

  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Overlay Configurator</h1>
            <p className="text-muted-foreground">
              Configure overlays for sim-racing games loaded from Steam Workshop
            </p>
          </div>
        </div>
        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="test">Run & Test</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>
          <TabsContent value="configure">
            <CreateOverlayConfigureTab manifest={manifest} onManifestChange={setManifest} />
          </TabsContent>
          <TabsContent value="test">
            <RunTestSection manifest={manifest} />
          </TabsContent>
          <TabsContent value="upload">
            <UploadSection />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default CreateOverlayRoute;
