import type { WorkshopItem as WorkshopItemType } from "@/shared/schemas/steamworks-schemas";
import { WorkshopItem } from "./workshop-item";

interface WorkshopGridProps {
  items: WorkshopItemType[];
  selectedItemId?: bigint | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemClick?: (item: any) => void;
  isPending: boolean;
}

export function WorkshopGrid({
  items,
  selectedItemId,
  onItemClick,
  isPending,
}: WorkshopGridProps) {
  if (isPending) return <WorkshopGridSkeleton />;

  return (
    <div
      className="grid gap-[7px]"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        maxWidth: "100%",
      }}
    >
      {items.map((item) => (
        <div
          key={item.publishedFileId}
          className="w-full"
          style={{
            minWidth: "200px",
            maxWidth: "400px",
          }}
        >
          <WorkshopItem
            {...item}
            onClick={() => onItemClick?.(item)}
            isItemsSelected={selectedItemId === item.publishedFileId}
          />
        </div>
      ))}
    </div>
  );
}

function WorkshopGridSkeleton() {
  return (
    <div
      className="grid gap-[7px]"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        maxWidth: "100%",
      }}
    >
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="w-full"
          style={{
            minWidth: "200px",
            maxWidth: "400px",
          }}
        >
          <WorkshopItemSkeleton />
        </div>
      ))}
    </div>
  );
}

function WorkshopItemSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg border-2 border-gray-200 bg-white">
      <div className="relative aspect-square">
        {/* Image skeleton */}
        <div className="h-full w-full animate-pulse bg-gray-300" />

        {/* Text overlay skeleton */}
        <div className="absolute right-0 bottom-0 left-0 z-10 p-3">
          <div className="rounded-md bg-black/70 p-2 backdrop-blur-sm">
            <div className="space-y-1">
              <div className="h-3 w-3/4 animate-pulse rounded bg-gray-400" />
              <div className="h-3 w-1/2 animate-pulse rounded bg-gray-400" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
