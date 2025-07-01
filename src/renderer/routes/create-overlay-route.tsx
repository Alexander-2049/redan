import { useState } from 'react';

import CreateOverlayConfigureTab from '@/renderer/components/create-overlay/create-overlay-configure-tab';
import { ScrollArea } from '@/renderer/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/renderer/components/ui/tabs';
import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

const CreateOverlayRoute = () => {
  const [manifest, setManifest] = useState<OverlayManifestFile>({
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
    settings: [],
    requiredFields: [],
    optionalFields: [],
  });

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
            <div className="text-muted-foreground p-8 text-center">
              Test functionality will be implemented here
            </div>
          </TabsContent>
          <TabsContent value="upload">
            <div className="text-muted-foreground p-8 text-center">
              Upload functionality will be implemented here
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default CreateOverlayRoute;
