import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface DimensionVisualizationProps {
  dimensions: OverlayManifestFile['dimentions'];
}

export const DimensionVisualization = ({ dimensions }: DimensionVisualizationProps) => {
  // Calculate dimensions for visualization (scaled down)
  const scale = 0.2;
  const maxBoxWidth = dimensions.maxWidth * scale;
  const maxBoxHeight = dimensions.maxHeight * scale;
  const defaultBoxWidth = dimensions.defaultWidth * scale;
  const defaultBoxHeight = dimensions.defaultHeight * scale;
  const minBoxWidth = dimensions.minWidth * scale;
  const minBoxHeight = dimensions.minHeight * scale;

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Max dimensions box */}
        <div
          className="relative flex items-center justify-center border-2 border-red-300 bg-red-50"
          style={{
            width: Math.max(maxBoxWidth, 60),
            height: Math.max(maxBoxHeight, 40),
          }}
        >
          <span className="text-xs font-medium text-red-600">Max</span>

          {/* Default dimensions box */}
          <div
            className="absolute flex items-center justify-center border-2 border-blue-300 bg-blue-50"
            style={{
              width: Math.max(defaultBoxWidth, 40),
              height: Math.max(defaultBoxHeight, 30),
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          >
            <span className="text-xs font-medium text-blue-600">Default</span>

            {/* Min dimensions box */}
            <div
              className="absolute flex items-center justify-center border-2 border-green-300 bg-green-50"
              style={{
                width: Math.max(minBoxWidth, 20),
                height: Math.max(minBoxHeight, 20),
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <span className="text-xs font-medium text-green-600">Min</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
