import { ILayoutDataAndFilename } from '@/main/_/layout-service/schemas';
import { ASSETS_URL, OVERLAY_SERVER_PORT } from '@/shared/constants';

interface Props {
  layout: ILayoutDataAndFilename;
  parentWidth: number;
  backgroundImage?: string | 'none';
}

export const LayoutPreview = ({ layout, parentWidth, backgroundImage }: Props) => {
  const layoutWidth = layout.data.screenWidth;
  const layoutHeight = layout.data.screenHeight;
  const scale = parentWidth / layoutWidth;
  const backgroundImageUrl =
    backgroundImage || `${ASSETS_URL}/images/738c2f57-adad-4978-898c-0ac778680d9b.jpg`;

  return (
    <div
      style={{
        width: `${parentWidth}px`,
        height: `${layoutHeight * scale}px`,
      }}
      className="flex w-full items-center justify-center"
    >
      <div
        className="relative shrink-0 border-2"
        style={{
          width: `${layoutWidth}px`,
          height: `${layoutHeight}px`,
          scale: `${scale}`,
          backgroundImage: backgroundImageUrl === 'none' ? 'none' : `url(${backgroundImageUrl})`,
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        {layout.data.overlays.map(overlay => {
          const overlayQueryParameters = overlay.settings
            .map(
              setting => `${encodeURIComponent(setting.id)}=${encodeURIComponent(setting.value)}`,
            )
            .join('&');
          const iframeUrl = `http://localhost:${OVERLAY_SERVER_PORT}/${overlay.folderName}?preview=true${overlayQueryParameters ? `&${overlayQueryParameters}` : ''}`;

          return (
            <iframe
              key={overlay.id}
              className="absolute"
              src={iframeUrl}
              style={{
                width: `${overlay.position.width}px`,
                height: `${overlay.position.height}px`,
                top: `${overlay.position.y}px`,
                left: `${overlay.position.x}px`,
              }}
            ></iframe>
          );
        })}
      </div>
    </div>
  );
};
