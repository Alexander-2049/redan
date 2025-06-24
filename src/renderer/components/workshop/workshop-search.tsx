import { Search } from "lucide-react";
import { Input } from "@/renderer/components/ui/input";
import { WorkshopHeader } from "./workshop-header";

interface WorkshopSearchProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onSearch: () => void;
  totalItems: number;
  sortBy: string;
  onSortChange: (value: string) => void;
}

export function WorkshopSearch({
  searchTerm,
  onSearchChange,
  onSearch,
  totalItems,
  sortBy,
  onSortChange,
}: WorkshopSearchProps) {
  return (
    <div className="mb-4 flex items-center gap-4">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform text-gray-400" />
        <Input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-gray-300 bg-white pl-10 text-gray-900 placeholder-gray-500"
          onKeyPress={(e) => e.key === "Enter" && onSearch()}
        />
      </div>
      <WorkshopHeader
        totalItems={totalItems}
        sortBy={sortBy}
        onSortChange={onSortChange}
      />
    </div>
  );
}
