import { useOverlayList } from '@/renderer/api/overlays/get-overlays';

interface OverlayListProps {
  overlays: {
    title: string;
    folderName: string;
  }[];
  openOverlay: (folderName: string) => void;
}

const OverlayList = ({ overlays, openOverlay: onOpen }: OverlayListProps) => {
  const { data } = useOverlayList();
  console.log(data);

  return (
    <div className="bg-accent/50 flex h-full w-60 min-w-0 shrink-0 flex-col border-l">
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
