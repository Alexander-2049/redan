import { Button } from "@/renderer/components/ui/button";
import { Badge } from "@/renderer/components/ui/badge";
import {
  Star,
  Download,
  Heart,
  Share,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
} from "lucide-react";
import { ScrollArea } from "@/renderer/components/ui/scroll-area";
import { useState } from "react";

interface WorkshopPreviewProps {
  item: {
    id: string;
    title: string;
    author: string;
    image: string;
    rating: number;
    downloads: number;
    views: number;
    tags: string[];
    isApproved?: boolean;
    description?: string;
    fileSize: string;
    uploadDate: string;
    lastUpdate: string;
  } | null;
  onClose: () => void;
  onSubscribe: (itemId: string) => void;
  onRate: (itemId: string, rating: "like" | "dislike") => void;
}

export function WorkshopPreview({
  item,
  // onClose,
  onSubscribe,
  onRate,
}: WorkshopPreviewProps) {
  const [userRating, setUserRating] = useState<"like" | "dislike" | null>(null);

  if (!item) return null;

  const handleRate = (rating: "like" | "dislike") => {
    setUserRating(rating);
    onRate(item.id, rating);
  };

  return (
    <div className="flex w-80 flex-shrink-0 flex-col border-l border-gray-200 bg-white">
      <div className="min-h-0 flex-1">
        <ScrollArea className="h-full">
          <div className="space-y-4 p-4">
            <div className="relative aspect-square">
              <img
                src={item.image || "/placeholder.svg?height=300&width=300"}
                alt={item.title}
                className="h-full w-full rounded-lg object-cover"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">{item.title}</h3>
              <p className="text-gray-600">by {item.author}</p>
            </div>

            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center">
                <Star className="mr-1 h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{item.rating.toFixed(1)}</span>
              </div>
              <div className="flex items-center">
                <Download className="mr-1 h-4 w-4" />
                <span>{item.downloads.toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => onSubscribe(item.id)}
                className="w-full bg-green-600 text-white hover:bg-green-700"
              >
                <Download className="mr-2 h-4 w-4" />
                Subscribe
              </Button>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Heart className="mr-1 h-4 w-4" />
                  Favorite
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Share className="mr-1 h-4 w-4" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Flag className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Rate this item</h4>
              <div className="flex space-x-2">
                <Button
                  variant={userRating === "like" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRate("like")}
                  className={`flex-1 ${
                    userRating === "like"
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "hover:border-green-300 hover:bg-green-50"
                  }`}
                >
                  <ThumbsUp className="mr-1 h-4 w-4" />
                  Like
                </Button>
                <Button
                  variant={userRating === "dislike" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleRate("dislike")}
                  className={`flex-1 ${
                    userRating === "dislike"
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "hover:border-red-300 hover:bg-red-50"
                  }`}
                >
                  <ThumbsDown className="mr-1 h-4 w-4" />
                  Dislike
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full">
                <MessageCircle className="mr-2 h-4 w-4" />
                Comment
              </Button>
            </div>

            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {item.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-gray-200 text-gray-700 hover:bg-gray-300"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {item.description && (
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-900">Description</h4>
                <p className="text-sm leading-relaxed text-gray-600">
                  {item.description}
                </p>
              </div>
            )}

            <div className="space-y-2 border-t border-gray-200 pt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">File Size:</span>
                  <p className="text-gray-900">{item.fileSize}</p>
                </div>
                <div>
                  <span className="text-gray-500">Uploaded:</span>
                  <p className="text-gray-900">{item.uploadDate}</p>
                </div>
                <div>
                  <span className="text-gray-500">Updated:</span>
                  <p className="text-gray-900">{item.lastUpdate}</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
