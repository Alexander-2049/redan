import { Bell, Gauge } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  return (
    <header className="flex h-14 items-center justify-between border-b bg-white p-2">
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <div className="flex h-10 w-10 items-center justify-center rounded bg-red-600">
            <Gauge className="h-6 w-6 text-white" />
          </div>
          <div className="ml-2 text-xl font-bold tracking-wider text-gray-700">
            RACE OVERLAY
          </div>
        </div>
        <div className="text-sm text-gray-600">v2.5.0</div>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="-mt-3 -ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-xs text-white">
            2
          </span>
        </div>
        <Button variant="outline" size="sm">
          Upgrade Pro
        </Button>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
          JD
        </div>
      </div>
    </header>
  );
};

export default Header;
