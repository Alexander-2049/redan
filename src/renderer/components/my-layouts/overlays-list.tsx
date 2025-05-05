import { ScrollArea } from "../ui/scroll-area";

const OverlaysList = () => {
  return (
    <div className="h-full overflow-hidden">
      <div className="bg-accent/10 flex h-full flex-col">
        <div className="flex-shrink-0 border-b p-3">
          <h2 className="text-lg font-semibold">Overlays</h2>
        </div>
        <ScrollArea className="overflow-y-auto">
          <div className="p-4">
            {/* Your overlays content here */}
            <div className="grid gap-4">
              {Array.from({ length: 50 }).map((_, i) => (
                <div key={i} className="bg-card h-20 rounded-md border p-4">
                  Overlay {i + 1}
                </div>
              ))}
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};

export default OverlaysList;
