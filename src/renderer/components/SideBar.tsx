import { Bug, Globe, Layout, LucideIcon, Paintbrush } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

import { ScrollArea } from './ui/scroll-area';

import { cn } from '@/renderer/lib/utils';

interface SidebarLink {
  text: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarLinkGroup {
  group: string;
  links: SidebarLink[];
}

const Sidebar = ({ isDebug }: { isDebug: boolean }) => {
  const location = useLocation();
  const { pathname } = location;

  const sidebarLinks: SidebarLinkGroup[] = [
    {
      group: 'MAIN',
      links: [
        { text: 'My Layouts', path: '/zlayouts', icon: Layout },
        { text: 'Workshop', path: '/workshop', icon: Globe },
        { text: 'Configurator', path: '/configurator', icon: Paintbrush },
      ],
    },
    ...(isDebug
      ? [
          {
            group: 'DEVELOPER',
            links: [{ text: 'Debug', path: '/debug', icon: Bug }],
          },
        ]
      : []),
  ];

  return (
    <ScrollArea className="bg-muted/10 border-r">
      <div className="flex w-56 flex-col gap-4 p-4">
        {sidebarLinks.map(group =>
          group.links.map(link => {
            const isActive = pathname.startsWith(link.path);

            return (
              <Link
                key={link.text}
                to={link.path}
                className={cn(
                  'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium shadow-sm transition-all duration-150',
                  'bg-white text-gray-800',
                  'hover:bg-gray-100 hover:shadow-md',
                  'active:translate-y-[1px] active:shadow-inner',
                  isActive && 'text-blue-600 shadow-md ring-2 ring-blue-400',
                )}
              >
                <link.icon className="h-5 w-5" />
                <span>{link.text}</span>
              </Link>
            );
          }),
        )}
      </div>
    </ScrollArea>
  );
};

export default Sidebar;
