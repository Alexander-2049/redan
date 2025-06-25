import { Button } from "@/renderer/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface WorkshopPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function WorkshopPagination({
  currentPage,
  totalPages,
  onPageChange,
}: WorkshopPaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, "...");
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push("...", totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  return (
    <div className="flex items-center justify-center space-x-2 py-4">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {getVisiblePages().map((page, index) => (
        <Button
          key={index}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => typeof page === "number" && onPageChange(page)}
          disabled={page === "..."}
          className={
            page === currentPage
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
          }
        >
          {page}
        </Button>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
