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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onItemClick?: (item: any) => void;
}

export function WorkshopGrid({ items, onItemClick }: WorkshopGridProps) {
  return (
    <div
      className="grid gap-[7px]"
      style={{
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        maxWidth: "100%",
      }}
    >
      {items.map((item) => (
        <div
          key={item.publishedFileId}
          className="w-full"
          style={{
            minWidth: "300px",
            maxWidth: "600px",
          }}
        >
          <WorkshopItem {...item} onClick={() => onItemClick?.(item)} />
        </div>
      ))}
    </div>
  );
}
