import { WorkshopItem as WorkshopItemType } from "@/shared/schemas/steamworks-schemas";
import { WorkshopItem } from "./workshop-item";

interface WorkshopGridProps {
  // items: Array<{
  //   id: string;
  //   title: string;
  //   author: string;
  //   image: string;
  //   rating: number;
  //   downloads: number;
  //   views: number;
  //   tags: string[];
  //   isApproved?: boolean;
  // }>;
  items: WorkshopItemType[];
  selectedItemId?: bigint | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemClick?: (item: any) => void;
}

export function WorkshopGrid({
  items,
  selectedItemId,
  onItemClick,
}: WorkshopGridProps) {
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
