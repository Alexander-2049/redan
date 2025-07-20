interface OverlayPreviewProps {
  defaultWidth: number;
  defaultHeight: number;
  parentHeight?: number;
  iframeUrl: string;
  backgroundImageUrl: string;
}

const OverlayPreview = ({
  parentHeight = 450,
  iframeUrl,
  backgroundImageUrl,
  defaultWidth,
  defaultHeight,
}: OverlayPreviewProps) => {
  const paddingY = 60;
  const iframeHeight = defaultHeight;
  const scale = Math.min((parentHeight - paddingY) / iframeHeight, 1);

  return (
    <div
      className="group relative w-full overflow-hidden rounded-md border shadow-sm transition-all duration-300 hover:shadow-lg"
      style={{
        backgroundImage: `url(${backgroundImageUrl})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        height: parentHeight,
      }}
    >
      <div className="absolute inset-0 w-full bg-black/0 transition-all duration-300 group-hover:bg-black/30" />
      <div className="relative h-full w-full transition-transform duration-300">
        <div className="animate-fadeIn relative z-0 flex h-full w-full items-center justify-center">
          <iframe
            src={iframeUrl}
            style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
            height={defaultHeight}
            width={defaultWidth}
            className="pointer-events-none transition-all duration-300 group-hover:scale-105"
          />
        </div>
      </div>
    </div>
  );
};

export default OverlayPreview;
