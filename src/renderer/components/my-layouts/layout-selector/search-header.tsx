import { Search } from 'lucide-react';

import { Input } from '../../ui/input';

interface SearchHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export const SearchHeader = ({ searchTerm, onSearchChange }: SearchHeaderProps) => {
  return (
    <div className="bg-background/95 sticky top-0 z-10 flex h-14 min-w-0 shrink-0 flex-row items-center gap-2 border-b p-3 backdrop-blur-sm">
      <div className="relative min-w-0 flex-1">
        <Search className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2" />
        <Input
          className="bg-background/50 border-border/50 focus:bg-background h-9 w-full pl-9 text-sm transition-colors"
          type="text"
          placeholder="Search layouts..."
          value={searchTerm}
          onChange={e => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
};
