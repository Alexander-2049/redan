import { Card } from '@/renderer/components/ui/card';
import { WorkshopItem } from '@/shared/schemas/steamworks-schemas';

interface WorkshopItemProps extends WorkshopItem {
  // id: string;
  // title: string;
  // author: string;
  // image: string;
  // rating: number;
  // downloads: number;
  // views: number;
  // tags: string[];
  // isApproved?: boolean;
  onClick?: () => void;
  isItemsSelected?: boolean;
}

export function WorkshopItem({ title, previewUrl, onClick, isItemsSelected }: WorkshopItemProps) {
  return (
    <Card
      className={`group cursor-pointer overflow-hidden border-2 bg-white p-0 transition-all hover:bg-gray-50 ${
        isItemsSelected ? 'border-sky-400 shadow-lg' : 'border-gray-200 hover:border-sky-300'
      }`}
      onClick={onClick}
    >
      <div className="relative aspect-square">
        {/* Image */}
        <img
          src={previewUrl || '/placeholder.svg?height=600&width=600' || '/placeholder.svg'}
          alt={title}
          className="h-full w-full object-cover transition-transform group-hover:scale-105"
        />

        {/* Text overlay at the bottom */}
        <div className="absolute right-0 bottom-0 left-0 z-10 p-3">
          <div className="rounded-md bg-black/70 p-2 backdrop-blur-sm">
            <h3 className="mb-1 line-clamp-2 text-sm leading-tight font-medium text-white drop-shadow-lg">
              {title}
            </h3>
          </div>
        </div>

        {/* Optional: Inner glow effect for selected state */}
        {isItemsSelected && <div className="pointer-events-none absolute inset-0 bg-sky-400/10" />}
      </div>
    </Card>
  );
}
