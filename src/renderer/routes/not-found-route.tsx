import { Button } from "@/renderer/components/ui/button";
import { Flag, Home, Search, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function NotFoundRoute() {
  return (
    <div className="mx-auto flex h-full max-w-3xl flex-col items-center justify-center p-6 pt-[24vh] text-center">
      <div className="space-y-4">
        <div className="inline-block rounded-full bg-red-100 px-3 py-1 text-sm font-medium text-red-800">
          404 Error
        </div>
        <h1 className="text-3xl font-bold">Not Found</h1>
        <p className="mx-auto max-w-md text-gray-500">
          The page you're looking for has crossed the finish line and is no
          longer available. It might have been moved, deleted, or never existed.
        </p>

        <div className="flex flex-col justify-center gap-4 pt-6 sm:flex-row">
          <Button
            variant="outline"
            className="gap-2 hover:cursor-pointer"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
          <Button className="gap-2" asChild>
            <Link to="/">
              <Home className="h-4 w-4" />
              Return to Dashboard
            </Link>
          </Button>
        </div>

        <div className="mt-8 border-t pt-8">
          <p className="mb-4 text-sm text-gray-500">
            Looking for something specific?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600"
            >
              <Flag className="h-4 w-4" />
              Popular Overlays
            </Link>
            <Link
              to="/"
              className="flex items-center gap-1 text-sm text-gray-700 hover:text-red-600"
            >
              <Search className="h-4 w-4" />
              Search All Content
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
