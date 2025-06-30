import { RotateCcw, Upload } from 'lucide-react';

import { Button } from '../ui/button';

const CreateOverlayConfigureTab = () => {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div></div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset All
          </Button>
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import Manifest
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateOverlayConfigureTab;
