interface OverlayListProps {
  overlays: {
    title: string;
    folderName: string;
  }[];
  openOverlay: (folderName: string) => void;
}

const OverlayList = ({ overlays, openOverlay: onOpen }: OverlayListProps) => {
  return (
    <div className="h-full w-3xs shrink-0 bg-red-50">
      {overlays.map(overlay => {
        return (
          <button
            onClick={() => {
              onOpen(overlay.folderName);
            }}
            key={overlay.folderName}
          >
            {overlay.title}
          </button>
        );
      })}
    </div>
  );
};

export default OverlayList;
