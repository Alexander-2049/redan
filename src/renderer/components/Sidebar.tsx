import {
  BarChart3,
  Bug,
  Clock,
  Flag,
  Gauge,
  HelpCircle,
  Layers,
  LayoutDashboard,
  MonitorPlay,
  PlusCircle,
  Settings,
  Timer,
  Users,
} from "lucide-react";
import { Button } from "@/renderer/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";

const sidebarLinks = [
  {
    group: "MAIN",
    links: [
      { text: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { text: "My Overlays", path: "/my-overlays", icon: Layers },
      { text: "Live Preview", path: "/live-preview", icon: MonitorPlay },
      { text: "Data Analysis", path: "/data-analysis", icon: BarChart3 },
    ],
  },
  {
    group: "RACING DATA",
    links: [
      { text: "Lap Times", path: "/lap-times", icon: Timer },
      { text: "Telemetry", path: "/telemetry", icon: Gauge },
      { text: "Race Results", path: "/race-results", icon: Flag },
      { text: "Competitors", path: "/competitors", icon: Users },
    ],
  },
  {
    group: "TEMPLATES",
    links: [
      { text: "Timing Screens", path: "/timing-screens", icon: Clock },
      {
        text: "Performance Graphs",
        path: "/performance-graphs",
        icon: BarChart3,
      },
      { text: "HUD Elements", path: "/hud-elements", icon: Layers },
    ],
  },
  {
    group: "DEVELOPER",
    links: [{ text: "Debug", path: "/debug", icon: Bug }],
  },
  {
    group: "OTHER",
    links: [
      { text: "Settings", path: "/settings", icon: Settings },
      { text: "Help & Support", path: "/help-support", icon: HelpCircle },
    ],
  },
];
const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div className="flex h-full w-64 shrink-0 flex-col border-r bg-white">
      {/* Scrollable Top Section */}
      <ScrollArea className="flex-grow overflow-y-auto">
        <div className="p-4">
          <Button className="w-full justify-start bg-red-600 text-white hover:bg-red-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Overlay
          </Button>
        </div>

        {sidebarLinks.map((group) => (
          <div key={group.group} className="p-2">
            <div className="mb-1 px-2 text-xs font-medium text-gray-500">
              {group.group}
            </div>
            {group.links.map((link) => (
              <Button
                key={link.text}
                variant="ghost"
                className={`w-full justify-start ${
                  pathname.startsWith(link.path) ? "bg-gray-100" : ""
                }`}
                asChild
              >
                <Link to={link.path}>
                  <link.icon className="mr-2 h-4 w-4" />
                  {link.text}
                </Link>
              </Button>
            ))}
          </div>
        ))}
      </ScrollArea>

      {/* Always Visible Bottom Section */}
      <div className="shrink-0 border-t p-4">
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
  );
};

export default Sidebar;
