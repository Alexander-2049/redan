import { useEffect, useState } from "react";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { WorkshopSearch } from "@/renderer/components/workshop/workshop-search";
import { WorkshopFilters } from "@/renderer/components/workshop/workshop-filters";
import { WorkshopGrid } from "@/renderer/components/workshop/workshop-grid";
import { WorkshopPagination } from "@/renderer/components/workshop/workshop-pagination";
import { WorkshopPreview } from "@/renderer/components/workshop/workshop-preview";
import { useWorkshopItems } from "../api/steam/workshop-get-all-items";
import { WorkshopItem } from "@/shared/schemas/steamworks-schemas";

// Mock data - replace with actual API calls
// const mockItems = Array.from({ length: 120 }, (_, i) => ({
//   id: `item-${i}`,
//   title: [
//     "Hollow Knight game wallpaper",
//     "Swimming Kirby [4K]",
//     "Cozy Winter by Alt Toads",
//     "Legacy Gift: Animated Gear - Clock - Plus Language",
//     "Minimalist Garage 1080 Colour Palettes",
//     "Salamander Rides by Alt Toads",
//     "Dancing Frogs by Alt Toads",
//     "Stardew Valley Dynamic Day",
//     "Windmills by VISUALDON",
//     "Rebelling River Alt Toads",
//   ][i % 10],
//   author: [
//     "Alt Toads",
//     "VISUALDON",
//     "ColdCast",
//     "GameArt Studio",
//     "PixelMaster",
//   ][i % 5],
//   image: `https://kzmklrq8vvrkua5n7z9d.lite.vusercontent.net/placeholder.svg?height=600&width=600&text=Item${i + 1}`,
//   rating: Math.round((4.2 + Math.random() * 0.8) * 10) / 10,
//   downloads: Math.floor(Math.random() * 50000) + 1000,
//   views: Math.floor(Math.random() * 100000) + 5000,
//   tags: [
//     ["Game", "Wallpaper"],
//     ["Anime", "Cute"],
//     ["Nature", "Cozy"],
//     ["Abstract", "Animated"],
//     ["Minimalist", "Cars"],
//   ][i % 5],
//   isApproved: Math.random() > 0.7,
//   description:
//     i % 3 === 0
//       ? "This is a beautiful and immersive wallpaper that will transform your desktop experience. Created with attention to detail and optimized for various screen resolutions."
//       : undefined,
//   fileSize: `${Math.floor(Math.random() * 50) + 5} MB`,
//   uploadDate: "Dec 15, 2023",
//   lastUpdate: "Jan 2, 2024",
// }));

const BrowseWorkshopRoute = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("popular-year");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedItem, setSelectedItem] = useState<WorkshopItem | null>(null);
  const { mutate: getWorkshopItems, data: workshop } = useWorkshopItems();
  const [items, setItems] = useState<WorkshopItem[]>([]);

  useEffect(() => {
    getWorkshopItems({ page: currentPage });
  }, [currentPage]);

  useEffect(() => {
    if (!workshop) return;
    setItems(
      workshop.items.filter((item): item is WorkshopItem => item != null),
    );
  }, [workshop]);

  const totalPages = 1000;

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemClick = (item: (typeof items)[0]) => {
    setSelectedItem(item);
  };

  const handleClosePreview = () => {
    setSelectedItem(null);
  };

  const handleSubscribe = (itemId: string) => {
    console.log("Subscribing to item:", itemId);
  };

  const handleRate = (itemId: string, rating: "like" | "dislike") => {
    console.log("Rating item:", itemId, "with", rating);
  };

  return (
    <div className="flex h-full bg-gray-100">
      <div className="flex h-full min-w-0 border-r border-gray-200 bg-gray-50 p-4">
        <ScrollArea className="h-full">
          <WorkshopFilters onResetFilters={handleResetFilters} />
        </ScrollArea>
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-shrink-0 border-b border-gray-200 bg-white p-4">
          <WorkshopSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            totalItems={items.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div>

        <div className="min-h-0 flex-1">
          <ScrollArea className="h-full">
            <div className="p-4">
              <WorkshopGrid items={items} onItemClick={handleItemClick} />
              <WorkshopPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* {selectedItem && (
        <WorkshopPreview
          item={selectedItem}
          onClose={handleClosePreview}
          onSubscribe={handleSubscribe}
          onRate={handleRate}
        />
      )} */}
    </div>
  );
};

export default BrowseWorkshopRoute;
