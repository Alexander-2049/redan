import { Bug, Layout, LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";
import { cn } from "@/renderer/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useEffect, useState } from "react";
interface SidebarLink {
  text: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarLinkGroup {
  group: string;
  links: SidebarLink[];
}

const Sidebar = () => {
  const location = useLocation();
  const { pathname } = location;
  const [isDebug, setIsDebug] = useState<boolean>(false);
  const [sidebarLinks, setSidebarLinks] = useState<SidebarLinkGroup[]>([
    {
      group: "MAIN",
      links: [
        // { text: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
        { text: "My Layouts", path: "/my-layouts", icon: Layout },
        // { text: "Live Preview", path: "/live-preview", icon: MonitorPlay },
        // { text: "Data Analysis", path: "/data-analysis", icon: BarChart3 },
      ],
    },
  ]);

  useEffect(() => {
    window.electron.isDebug().then((isDebug) => {
      setIsDebug(isDebug);
    });
  }, []);

  useEffect(() => {
    if (isDebug)
      setSidebarLinks((prev) => [
        ...prev,
        {
          group: "DEVELOPER",
          links: [{ text: "Debug", path: "/debug", icon: Bug }],
        },
      ]);
  }, [isDebug]);

  return (
    <ScrollArea className="border-r">
      <div className="bg-muted/20 flex w-16 flex-col items-center py-4">
        <TooltipProvider>
          <div className="flex flex-col items-center space-y-2">
            {sidebarLinks.map((group) =>
              group.links.map((link) => (
                <Tooltip key={link.text}>
                  <TooltipTrigger asChild>
                    <Link
                      to={link.path}
                      title={link.text}
                      className={cn(
                        "relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 shadow-md transition-all duration-300 hover:scale-110 active:scale-90",
                        pathname.startsWith(link.path)
                          ? "scale-110 bg-blue-100 text-blue-600 ring-blue-500"
                          : "",
                      )}
                    >
                      <link.icon />
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={5}>
                    {link.text}
                  </TooltipContent>
                </Tooltip>
              )),
            )}
          </div>
        </TooltipProvider>
      </div>
    </ScrollArea>
  );
};

export default Sidebar;
