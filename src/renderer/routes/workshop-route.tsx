import { useEffect, useState } from 'react';

import { ScrollArea } from '../components/ui/scroll-area';
import { WorkshopGrid } from '../components/workshop/workshop-grid';
import { WorkshopPagination } from '../components/workshop/workshop-pagination';
import { useWorkshopPage } from '../hooks/useWorkshopAllItems';

import { WorkshopItem } from '@/shared/types/steam';

export const WorkshopRoute = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data, isFetching } = useWorkshopPage(currentPage);
  const [items, setItems] = useState<WorkshopItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<WorkshopItem | null>(null);

  useEffect(() => {
    if (data && data.items) {
      const currentPageItems = data.items.filter(e => !!e);
      if (currentPageItems) {
        setItems(currentPageItems);
      }
    } else {
      setItems([]);
    }
  }, [data, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemClick = (item: (typeof items)[0]) => {
    setSelectedItem(item);
  };

  return (
    <div className="flex h-full bg-gray-100">
      {/* <div className="flex h-full min-w-0 border-r border-gray-200 bg-gray-50 p-4">
        <ScrollArea className="h-full">
          <WorkshopFilters onResetFilters={handleResetFilters} />
        </ScrollArea>
      </div> */}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* <div className="flex-shrink-0 border-b border-gray-200 bg-white p-4">
          <WorkshopSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
            totalItems={items.length}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />
        </div> */}

        {/* Split layout: Grid takes remaining space, Pagination is fixed at bottom */}
        <div className="flex min-h-0 flex-1 flex-col">
          {/* Items Grid - Scrollable area that takes all available space */}
          <div className="flex-1 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="p-4">
                <WorkshopGrid
                  items={items}
                  isLoading={isFetching}
                  onItemClick={handleItemClick}
                  selectedItemId={selectedItem?.publishedFileId}
                />
              </div>
            </ScrollArea>
          </div>

          {/* Pagination - Fixed at bottom */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-white">
            <WorkshopPagination
              currentPage={currentPage}
              totalPages={1000}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* {selectedItem && (
        <WorkshopPreview
          item={selectedItem}
          onClose={handleClosePreview}
          onSubscribe={handleSubscribe}
          onUnsubscribe={handleUnsubscribe}
          onRate={handleRate}
          isSubscribed={isSubscribedOnSelectedItem}
          downloadInfo={downloadInfo ? downloadInfo : null}
          // const { data: downloadInfo } = useWorkshopDownloadInfo();
          // const { mutate: download } = useWorkshopDownloadItem();
        />
      )} */}
    </div>
  );
};

// import { useEffect, useState } from 'react';

// import { useWorkshopDownloadInfo } from '../api/steam/workshop-download-info';
// import { useWorkshopDownloadItem } from '../api/steam/workshop-download-item';
// import { useWorkshopItems } from '../api/steam/workshop-get-all-items';
// import { useWorkshopSubscribedItems } from '../api/steam/workshop-get-subscribed-items';
// import { useWorkshopSubscribeItem } from '../api/steam/workshop-subscribe-item';
// import { useWorkshopUnsubscribeItem } from '../api/steam/workshop-unsubscribe-item';

// import { ScrollArea } from '@/renderer/components/ui/scroll-area';
// import { WorkshopFilters } from '@/renderer/components/workshop/workshop-filters';
// import { WorkshopGrid } from '@/renderer/components/workshop/workshop-grid';
// import { WorkshopPagination } from '@/renderer/components/workshop/workshop-pagination';
// import { WorkshopPreview } from '@/renderer/components/workshop/workshop-preview';
// import { WorkshopSearch } from '@/renderer/components/workshop/workshop-search';
// import type { WorkshopItem } from '@/shared/schemas/steamworks-schemas';

// const WorkshopRoute = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [sortBy, setSortBy] = useState('popular-year');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedItem, setSelectedItem] = useState<WorkshopItem | null>(null);
//   const [isSubscribedOnSelectedItem, setIsSubscribedOnSelectedItem] = useState(false);
//   const {
//     mutate: getWorkshopItems,
//     data: workshop,
//     isPending: isWorkshopItemsPending,
//   } = useWorkshopItems();
//   const [items, setItems] = useState<WorkshopItem[]>([]);
//   const { mutate: subscribe } = useWorkshopSubscribeItem();
//   const { mutate: unsubscribe } = useWorkshopUnsubscribeItem();
//   const { data: subscribedItems } = useWorkshopSubscribedItems();
//   const { data: downloadInfo, refetch: refetchWorkshopDownloadInfo } = useWorkshopDownloadInfo(
//     selectedItem ? selectedItem.publishedFileId : null,
//   );
//   const { mutate: download } = useWorkshopDownloadItem();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       refetchWorkshopDownloadInfo();
//     }, 100);
//     return () => {
//       clearInterval(interval);
//     };
//   });

//   // useEffect(() => {
//   //   console.log(downloadInfo);
//   // }, [downloadInfo]);

//   // useEffect(() => {
//   //   console.log(
//   //     subscribedItems,
//   //     isSubscribedItemsPending,
//   //     isLoading,
//   //     isRefetching,
//   //   );
//   // }, [subscribedItems, isSubscribedItemsPending, isLoading, isRefetching]);

//   useEffect(() => {
//     if (!subscribedItems || !selectedItem) return;
//     refetchWorkshopDownloadInfo();

//     const a = selectedItem.publishedFileId.toString();
//     const b = subscribedItems.map(c => c.toString());

//     setIsSubscribedOnSelectedItem(b.includes(a));
//   }, [subscribedItems, selectedItem]);

//   useEffect(() => {
//     getWorkshopItems({ page: currentPage });
//   }, [currentPage]);

//   useEffect(() => {
//     if (!workshop) return;
//     setItems(workshop.items.filter((item): item is WorkshopItem => item != null));
//   }, [workshop]);

//   const totalPages = 1000;

//   const handleDownload = (itemId: bigint) => {
//     console.log('Downloading item:', itemId);
//     download({ itemId });
//   };

//   const handleSearch = () => {
//     setCurrentPage(1);
//   };

//   const handleResetFilters = () => {
//     setSearchTerm('');
//     setCurrentPage(1);
//   };

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const handleItemClick = (item: (typeof items)[0]) => {
//     setSelectedItem(item);
//   };

//   const handleClosePreview = () => {
//     setSelectedItem(null);
//   };

//   const handleSubscribe = (itemId: bigint) => {
//     console.log('Subscribing to item:', itemId);
//     subscribe({ item: itemId });
//     handleDownload(itemId);
//     refetchWorkshopDownloadInfo();
//   };
//   const handleUnsubscribe = (itemId: bigint) => {
//     console.log('Unsubscribing item:', itemId);
//     unsubscribe({ item: itemId });
//   };

//   const handleRate = (itemId: bigint, rating: 'like' | 'dislike') => {
//     console.log('Rating item:', itemId, 'with', rating);
//   };

//   return (
//     <div className="flex h-full bg-gray-100">
//       <div className="flex h-full min-w-0 border-r border-gray-200 bg-gray-50 p-4">
//         <ScrollArea className="h-full">
//           <WorkshopFilters onResetFilters={handleResetFilters} />
//         </ScrollArea>
//       </div>

//       <div className="flex min-w-0 flex-1 flex-col">
//         <div className="flex-shrink-0 border-b border-gray-200 bg-white p-4">
//           <WorkshopSearch
//             searchTerm={searchTerm}
//             onSearchChange={setSearchTerm}
//             onSearch={handleSearch}
//             totalItems={items.length}
//             sortBy={sortBy}
//             onSortChange={setSortBy}
//           />
//         </div>

//         {/* Split layout: Grid takes remaining space, Pagination is fixed at bottom */}
//         <div className="flex min-h-0 flex-1 flex-col">
//           {/* Items Grid - Scrollable area that takes all available space */}
//           <div className="flex-1 overflow-hidden">
//             <ScrollArea className="h-full">
//               <div className="p-4">
//                 <WorkshopGrid
//                   items={items}
//                   onItemClick={handleItemClick}
//                   selectedItemId={selectedItem?.publishedFileId}
//                   isPending={isWorkshopItemsPending}
//                 />
//               </div>
//             </ScrollArea>
//           </div>

//           {/* Pagination - Fixed at bottom */}
//           <div className="flex-shrink-0 border-t border-gray-200 bg-white">
//             <WorkshopPagination
//               currentPage={currentPage}
//               totalPages={totalPages}
//               onPageChange={handlePageChange}
//             />
//           </div>
//         </div>
//       </div>

//       {selectedItem && (
//         <WorkshopPreview
//           item={selectedItem}
//           onClose={handleClosePreview}
//           onSubscribe={handleSubscribe}
//           onUnsubscribe={handleUnsubscribe}
//           onRate={handleRate}
//           isSubscribed={isSubscribedOnSelectedItem}
//           downloadInfo={downloadInfo ? downloadInfo : null}
//           // const { data: downloadInfo } = useWorkshopDownloadInfo();
//           // const { mutate: download } = useWorkshopDownloadItem();
//         />
//       )}
//     </div>
//   );
// };

// export default WorkshopRoute;
