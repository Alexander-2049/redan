import { Download, RotateCcw, Upload } from 'lucide-react';

import CreateOverlayConfigureTab from '../components/create-overlay/create-overlay-configure-tab';
import { Button } from '../components/ui/button';
import { ScrollArea } from '../components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

const CreateOverlayRoute = () => {
  return (
    <ScrollArea className="w-full">
      <div className="container mx-auto max-w-6xl p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Overlay Configurator</h1>
            <p className="text-muted-foreground">
              Configure overlays for sim-racing games loaded from Steam Workshop
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset All
            </Button>
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              Import Manifest
            </Button>
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Manifest
            </Button>
          </div>
        </div>

        <input type="file" accept=".json" style={{ display: 'none' }} />
        <Tabs defaultValue="configure" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="configure">Configure</TabsTrigger>
            <TabsTrigger value="test">Run & Test</TabsTrigger>
            <TabsTrigger value="upload">Upload</TabsTrigger>
          </TabsList>

          <TabsContent value="configure">
            <CreateOverlayConfigureTab />
          </TabsContent>

          <TabsContent value="test">
            <div>Test</div>
          </TabsContent>

          <TabsContent value="upload">
            <div>Upload</div>
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
};

export default CreateOverlayRoute;
