import {
  BarChart3,
  Clock,
  Flag,
  Gauge,
  HelpCircle,
  Layers,
  MonitorPlay,
  PlusCircle,
  Settings,
  Timer,
  Users,
} from "lucide-react";
import { Button } from "@/renderer/components/ui/button";

const Sidebar = () => {
  return (
    <div className="flex w-64 flex-col border-r bg-white">
      <div className="p-4">
        <Button className="w-full justify-start bg-red-600 text-white hover:bg-red-700">
          <PlusCircle className="mr-2 h-4 w-4" />
          New Overlay
        </Button>
      </div>

      <div className="p-2">
        <div className="mb-1 px-2 text-xs font-medium text-gray-500">MAIN</div>
        <Button variant="ghost" className="w-full justify-start bg-gray-100">
          <Layers className="mr-2 h-4 w-4" />
          My Overlays
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <MonitorPlay className="mr-2 h-4 w-4" />
          Live Preview
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <BarChart3 className="mr-2 h-4 w-4" />
          Data Analysis
        </Button>
      </div>

      <div className="p-2">
        <div className="mb-1 px-2 text-xs font-medium text-gray-500">
          RACING DATA
        </div>
        <Button variant="ghost" className="w-full justify-start">
          <Timer className="mr-2 h-4 w-4" />
          Lap Times
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Gauge className="mr-2 h-4 w-4" />
          Telemetry
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Flag className="mr-2 h-4 w-4" />
          Race Results
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Users className="mr-2 h-4 w-4" />
          Competitors
        </Button>
      </div>

      <div className="p-2">
        <div className="mb-1 px-2 text-xs font-medium text-gray-500">
          TEMPLATES
        </div>
        <Button variant="ghost" className="w-full justify-start">
          <Clock className="mr-2 h-4 w-4" />
          Timing Screens
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <BarChart3 className="mr-2 h-4 w-4" />
          Performance Graphs
        </Button>
        <Button variant="ghost" className="w-full justify-start">
          <Layers className="mr-2 h-4 w-4" />
          HUD Elements
        </Button>
      </div>

      <div className="mt-auto">
        <div className="p-2">
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <HelpCircle className="mr-2 h-4 w-4" />
            Help & Support
          </Button>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center">
            <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
              JD
            </div>
            <div>
              <div className="text-sm font-medium">John Driver</div>
              <div className="text-xs text-gray-500">Free Plan</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
