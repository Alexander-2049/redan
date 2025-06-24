import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/renderer/components/ui/select";

interface WorkshopHeaderProps {
  totalItems: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function WorkshopHeader({ sortBy, onSortChange }: WorkshopHeaderProps) {
  return (
    <div className="flex items-center justify-end">
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger className="w-48 border-gray-300 bg-white text-gray-900">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="popular-year">Most Popular (Year)</SelectItem>
          <SelectItem value="popular-month">Most Popular (Month)</SelectItem>
          <SelectItem value="popular-week">Most Popular (Week)</SelectItem>
          <SelectItem value="popular-day">Most Popular (Day)</SelectItem>
          <SelectItem value="recent">Most Recent</SelectItem>
          <SelectItem value="trending">Trending</SelectItem>
          <SelectItem value="rating">Highest Rated</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
