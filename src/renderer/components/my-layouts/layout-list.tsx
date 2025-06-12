import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Search, Trash2, Layout } from "lucide-react";
import { cn } from "@/renderer/lib/utils";
import { Input } from "@/renderer/components/ui/input";
import { Button } from "@/renderer/components/ui/button";
import { useLayouts } from "@/renderer/api/layouts/get-layouts";
import type { ILayoutDataAndFilename } from "@/main/services/layout-service/schemas/layoutSchema";
import { useDeleteLayout } from "@/renderer/api/layouts/delete-layout";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/renderer/components/ui/alert-dialog";
import { useSetActiveLayout } from "@/renderer/api/layouts/set-active-layout";
import { NewLayoutButton } from "./new-layout-button";

function LayoutSelector() {
  const layouts = useLayouts();
  const { mutate: deleteLayout } = useDeleteLayout();
  const { mutate: setActiveLayout } = useSetActiveLayout();
  const [searchQuery, setSearchQuery] = useState("");
  const [layoutToDelete, setLayoutToDelete] = useState<string | null>(null);
  const [newLayoutIds, setNewLayoutIds] = useState<Set<string>>(new Set());
  const [hasInitialLoad, setHasInitialLoad] = useState(false);
  const previousLayoutsRef = useRef<ILayoutDataAndFilename[]>([]);

  // Track new layouts
  useEffect(() => {
    if (layouts.data) {
      // Mark that we've had our first successful data load
      if (!hasInitialLoad) {
        setHasInitialLoad(true);
        // If there are layouts on first load, don't animate them
        if (layouts.data.length > 0) {
          previousLayoutsRef.current = layouts.data;
          return;
        }
      }

      // Compare with previous layouts to find new ones
      const previousIds = new Set(
        previousLayoutsRef.current.map((l) => l.filename),
      );
      const currentIds = new Set(layouts.data.map((l) => l.filename));

      // Find newly added layouts
      const newIds = new Set<string>();
      for (const id of currentIds) {
        if (!previousIds.has(id)) {
          newIds.add(id);
        }
      }

      if (newIds.size > 0) {
        setNewLayoutIds(newIds);
        // Clear the new layout indicators after animation completes
        setTimeout(() => {
          setNewLayoutIds(new Set());
        }, 3000); // 3 seconds to account for the full animation
      }

      previousLayoutsRef.current = layouts.data;
    }
  }, [layouts.data, hasInitialLoad]);

  if (!layouts.data) return null;

  const filteredItems = layouts.data.filter((item) =>
    item.data.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDeleteConfirm = () => {
    if (layoutToDelete) {
      deleteLayout({ fileName: layoutToDelete });
      setLayoutToDelete(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation();

    if (e.shiftKey) {
      deleteLayout({ fileName: filename });
    } else {
      setLayoutToDelete(filename);
    }
  };

  const handleSelectLayout = (layout: ILayoutDataAndFilename) => {
    setActiveLayout({ fileName: layout.filename });
  };

  return (
    <div className="bg-muted/20 grid h-full w-64 grid-rows-[auto_1fr_auto] overflow-hidden border-r">
      {/* Search Header */}
      <div className="bg-background/95 sticky top-0 z-10 border-b p-3 backdrop-blur-sm">
        <div className="relative">
          <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
          <Input
            placeholder="Search layouts..."
            className="bg-muted/50 h-9 pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Layouts List */}
      <ScrollArea className="overflow-y-auto">
        {filteredItems.length > 0 ? (
          <div className="py-1">
            {filteredItems.map((item) => {
              const isNew = newLayoutIds.has(item.filename);

              return (
                <div
                  key={item.filename}
                  role="button"
                  tabIndex={0}
                  className={cn(
                    "border-border/50 group relative grid w-full cursor-default grid-cols-[auto_1fr_auto] items-center gap-2 border-b bg-white px-3 py-2 text-left transition-all duration-300",
                    item.data.active
                      ? "border-blue-200 bg-blue-50 text-blue-600"
                      : "hover:bg-gray-50",
                    isNew && "animate-new-layout",
                  )}
                  onClick={() => handleSelectLayout(item)}
                  aria-pressed={item.data.active}
                  style={{
                    animation: isNew
                      ? "smoothSlideInAndShine 3s ease-out"
                      : undefined,
                  }}
                >
                  <Layout
                    size={16}
                    className={cn(
                      "text-muted-foreground",
                      item.data.active ? "text-blue-500" : "",
                    )}
                    aria-hidden="true"
                  />

                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {item.data.name}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100 focus:opacity-100"
                    onClick={(e) => handleDeleteClick(e, item.filename)}
                    aria-label={`Delete ${item.data.name} layout`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-muted-foreground p-4 text-center text-sm">
            No layouts found
          </div>
        )}
      </ScrollArea>

      {/* New Layout Button */}
      <div className="border-t p-3">
        <NewLayoutButton />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!layoutToDelete}
        onOpenChange={(open) => !open && setLayoutToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Layout</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this layout? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes smoothSlideInAndShine {
          0% {
            opacity: 0;
            transform: translateX(30px) scale(0.9);
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(224, 242, 254, 0.8) 50%,
              rgba(255, 255, 255, 1) 100%
            );
            box-shadow: 0 0 0 rgba(59, 130, 246, 0);
          }
          
          20% {
            opacity: 1;
            transform: translateX(0) scale(1);
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(187, 222, 251, 0.9) 50%,
              rgba(255, 255, 255, 1) 100%
            );
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
          }
          
          40% {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(147, 197, 253, 0.7) 50%,
              rgba(255, 255, 255, 1) 100%
            );
            box-shadow: 0 0 12px rgba(59, 130, 246, 0.4);
          }
          
          60% {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(187, 222, 251, 0.5) 50%,
              rgba(255, 255, 255, 1) 100%
            );
            box-shadow: 0 0 8px rgba(59, 130, 246, 0.2);
          }
          
          80% {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 1) 0%,
              rgba(224, 242, 254, 0.3) 50%,
              rgba(255, 255, 255, 1) 100%
            );
            box-shadow: 0 0 4px rgba(59, 130, 246, 0.1);
          }
          
          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 0 0 rgba(59, 130, 246, 0);
          }
        }
        
        @keyframes pulseGreen {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.2);
          }
        }
      `}</style>
    </div>
  );
}

export default LayoutSelector;
