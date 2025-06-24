import { Card } from "@/renderer/components/ui/card";

interface WorkshopItemProps {
  id: string;
  title: string;
  author: string;
  image: string;
  rating: number;
  downloads: number;
  views: number;
  tags: string[];
  isApproved?: boolean;
  onClick?: () => void;
}

export function WorkshopItem({
  title,
  author,
  image,
  onClick,
}: WorkshopItemProps) {
  return (
    <Card
      className="group cursor-pointer overflow-hidden border-gray-200 bg-white p-0 transition-colors hover:bg-gray-50"
      onClick={onClick}
    >
      <div className="relative aspect-square">
        {/* Image */}
        <img
          src={
            image ||
            "https://kzmklrq8vvrkua5n7z9d.lite.vusercontent.net/placeholder.svg?height=600&width=600"
          }
          alt={title}
          className="h-full w-full object-cover"
        />

        {/* Text overlay at the bottom */}
        <div className="absolute right-0 bottom-0 left-0 z-10 p-3">
          <div className="rounded-md bg-black/70 p-2 backdrop-blur-sm">
            <h3 className="mb-1 line-clamp-2 text-sm leading-tight font-medium text-white drop-shadow-lg">
              {title}
            </h3>
            <p className="text-xs text-white/90 drop-shadow-lg">by {author}</p>
          </div>
        </div>

        {/* Hover overlay */}
        {/* <div className="bg-opacity-0 group-hover:bg-opacity-20 absolute inset-0 bg-black transition-all" /> */}
      </div>
    </Card>
  );
}
