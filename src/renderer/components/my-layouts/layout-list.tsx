import { useState } from "react";
import { Search, Trash2, Plus, Layout } from "lucide-react";
import { cn } from "@/renderer/lib/utils";
import { Input } from "@/renderer/components/ui/input";
import { Button } from "@/renderer/components/ui/button";
import { useLayouts } from "@/renderer/api/layouts/get-layouts";
import type { ILayoutDataAndFilename } from "@/main/services/layoutService/schemas/layoutSchema";
import { useDeleteLayout } from "@/renderer/api/layouts/delete-layout";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { useCreateLayout } from "@/renderer/api/layouts/create-layout";
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

function LayoutSelector() {
  const layouts = useLayouts();
  const { mutate: deleteLayout } = useDeleteLayout();
  const { mutate: createLayout } = useCreateLayout();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] =
    useState<ILayoutDataAndFilename | null>();
  const [layoutToDelete, setLayoutToDelete] = useState<string | null>(null);

  if (!layouts.data) return null;

  const filteredItems = layouts.data.filter((item) =>
    item.data.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateLayout = () => {
    createLayout({
      layoutName: "new layout",
      layoutDescription: "",
    });
  };

  const handleDeleteConfirm = () => {
    if (layoutToDelete) {
      deleteLayout({ fileName: layoutToDelete });
      setLayoutToDelete(null);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, filename: string) => {
    e.stopPropagation(); // Prevent triggering the parent's onClick

    if (e.shiftKey) {
      // Delete immediately if Shift key is pressed
      deleteLayout({ fileName: filename });
    } else {
      // Otherwise show confirmation dialog
      setLayoutToDelete(filename);
    }
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
            {filteredItems.map((item) => (
              <div
                key={item.filename}
                role="button"
                tabIndex={0}
                className={cn(
                  "border-border/50 group relative grid w-full cursor-default grid-cols-[auto_1fr_auto] items-center gap-2 border-b px-3 py-2 text-left transition-colors",
                  selectedItem?.filename === item.filename
                    ? "border-blue-200 bg-blue-100 text-blue-600"
                    : "hover:bg-muted/50",
                )}
                onClick={() => setSelectedItem(item)}
                aria-pressed={selectedItem?.filename === item.filename}
              >
                <Layout
                  size={16}
                  className={cn(
                    "text-muted-foreground",
                    selectedItem?.filename === item.filename
                      ? "text-blue-500"
                      : "",
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
            ))}
          </div>
        ) : (
          <div className="text-muted-foreground p-4 text-center text-sm">
            No layouts found
          </div>
        )}
      </ScrollArea>

      {/* New Layout Button */}
      <div className="border-t p-3">
        <Button
          onClick={handleCreateLayout}
          className="w-full bg-blue-100 text-blue-600 shadow-sm hover:bg-blue-200"
        >
          <Plus size={16} className="mr-1" />
          New Layout
        </Button>
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
    </div>
  );
}

export default LayoutSelector;
