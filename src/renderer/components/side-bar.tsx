import {
  // BarChart3,
  Bug,
  // Clock,
  // Flag,
  // Gauge,
  // HelpCircle,
  Layers,
  Layout,
  // LayoutDashboard,
  // MonitorPlay,
  // PlusCircle,
  // Settings,
  // Timer,
  // Users,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/renderer/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

const sidebarLinks = [
  {
    group: "MAIN",
    links: [
      // { text: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
      { text: "My Overlays", path: "/my-overlays", icon: Layers },
      { text: "My Layouts", path: "/my-layouts", icon: Layout },
      // { text: "Live Preview", path: "/live-preview", icon: MonitorPlay },
      // { text: "Data Analysis", path: "/data-analysis", icon: BarChart3 },
    ],
  },
  // {
  //   group: "RACING DATA",
  //   links: [
  // { text: "Lap Times", path: "/lap-times", icon: Timer },
  // { text: "Telemetry", path: "/telemetry", icon: Gauge },
  // { text: "Race Results", path: "/race-results", icon: Flag },
  // { text: "Competitors", path: "/competitors", icon: Users },
  //   ],
  // },
  // {
  //   group: "TEMPLATES",
  //   links: [
  // { text: "Timing Screens", path: "/timing-screens", icon: Clock },
  // {
  //   text: "Performance Graphs",
  //   path: "/performance-graphs",
  //   icon: BarChart3,
  // },
  // { text: "HUD Elements", path: "/hud-elements", icon: Layers },
  // ],
  // },
  {
    group: "DEVELOPER",
    links: [{ text: "Debug", path: "/debug", icon: Bug }],
  },
  // {
  //   group: "OTHER",
  //   links: [
  //     { text: "Settings", path: "/settings", icon: Settings },
  //     { text: "Help & Support", path: "/help-support", icon: HelpCircle },
  //   ],
  // },
];
const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <ScrollArea className="border-r">
      <div className="bg-muted/20 flex w-16 flex-col items-center py-4">
        <TooltipProvider>
          <div className="flex flex-col items-center space-y-2">
            {sidebarLinks.map((group) => (
              <div key={group.group} className="space-y-2">
                {group.links.map((link) => (
                  <Tooltip key={link.text}>
                    <TooltipTrigger
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 shadow-md transition-all duration-300 hover:scale-110 active:scale-90",
                        pathname.startsWith(link.path)
                          ? "bg-blue-100 text-blue-600 ring-2 ring-blue-500"
                          : "",
                      )}
                    >
                      <Link to={link.path} title={link.text}>
                        <link.icon />
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5}>
                      {link.text}
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            ))}
          </div>
        </TooltipProvider>
      </div>
    </ScrollArea>
  );
};

export default Sidebar;
