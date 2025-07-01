import type { OverlayManifestFile } from '@/shared/types/OverlayManifestFile';

interface DimensionVisualizationProps {
  dimensions: OverlayManifestFile['dimentions'];
}

export const DimensionVisualization = ({ dimensions }: DimensionVisualizationProps) => {
  const scale = 0.2;
  const { maxWidth, maxHeight, defaultWidth, defaultHeight, minWidth, minHeight } = dimensions;

  const maxBoxWidth = maxWidth * scale;
  const maxBoxHeight = maxHeight * scale;
  const defaultBoxWidth = defaultWidth * scale;
  const defaultBoxHeight = defaultHeight * scale;
  const minBoxWidth = minWidth * scale;
  const minBoxHeight = minHeight * scale;

  // Validate relationships
  const isMinLargerThanMax = minWidth > maxWidth || minHeight > maxHeight;
  const isDefaultLargerThanMax = defaultWidth > maxWidth || defaultHeight > maxHeight;
  const isDefaultSmallerThanMin = defaultWidth < minWidth || defaultHeight < minHeight;

  const minBoxClass = isMinLargerThanMax
    ? 'border-yellow-500 bg-yellow-100'
    : 'border-green-300 bg-green-50';
  const defaultBoxClass =
    isDefaultLargerThanMax || isDefaultSmallerThanMin
      ? 'border-yellow-500 bg-yellow-100'
      : 'border-blue-300 bg-blue-50';
  const maxBoxClass = 'border-red-300 bg-red-50';

  return (
    <div className="flex justify-center">
      <div className="relative">
        {/* Max dimensions box */}
        <div
          className={`relative flex items-center justify-center border-2 ${maxBoxClass}`}
          style={{
            width: Math.max(maxBoxWidth, 60),
            height: Math.max(maxBoxHeight, 40),
          }}
        >
          <span className="text-xs font-medium text-red-600">Max</span>

          {/* Default dimensions box */}
          <div
            className={`absolute flex items-center justify-center border-2 ${defaultBoxClass}`}
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
              className={`absolute flex items-center justify-center border-2 ${minBoxClass}`}
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
