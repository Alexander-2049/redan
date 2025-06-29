import { LucideIcon } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

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

interface SidebarProps {
  sidebarLinks: SidebarLinkGroup[];
}

const Sidebar = ({ sidebarLinks }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <ScrollArea className="bg-muted/10 border-r">
      <div className="w-24 p-3 xl:w-56">
        {sidebarLinks.map(group => (
          <div key={group.group} className="mb-2 xl:mb-6">
            <div className="mb-2 hidden px-2 text-xs font-semibold tracking-wider text-gray-500 uppercase xl:block">
              {group.group}
            </div>
            <div className="flex flex-col gap-2">
              {group.links.map(link => {
                const isActive = pathname.startsWith(link.path);

                return (
                  <Link
                    key={link.text}
                    to={link.path}
                    className={cn(
                      'flex flex-col items-center xl:flex-row xl:items-center xl:justify-start',
                      'rounded-xl px-2 py-2 text-sm font-medium transition-all duration-150',
                      'hover:bg-gray-100 hover:shadow-md',
                      'active:translate-y-[1px] active:shadow-inner',
                      isActive
                        ? 'bg-white text-blue-600 shadow-md ring-2 ring-blue-400'
                        : 'text-gray-800',
                    )}
                  >
                    <link.icon className="h-5 w-5" />
                    <span
                      className={cn(
                        'mt-1 text-center xl:mt-0 xl:ml-2 xl:text-left',
                        'text-xs leading-tight xl:text-sm',
                      )}
                    >
                      {link.text}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
};

export default Sidebar;
