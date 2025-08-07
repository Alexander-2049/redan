import type { LucideIcon } from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';

import { useIsEditMode } from '../api/layouts/is-edit-mode';
import { useSetEditMode } from '../api/layouts/set-edit-mode';

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

interface CollapsedSidebarProps {
  sidebarLinks: SidebarLinkGroup[];
}

const Sidebar = ({ sidebarLinks }: CollapsedSidebarProps) => {
  const location = useLocation();
  const { pathname } = location;
  const { data: isEditMode } = useIsEditMode();
  const { mutate: setEditMode } = useSetEditMode();

  return (
    <ScrollArea className="bg-muted/10 border-r">
      <div className="w-20 p-2">
        <button
          onClick={() => {
            setEditMode({ isEditMode: !isEditMode });
          }}
          className={isEditMode ? 'bg-sky-400' : 'bg-gray-200'}
        >
          EDIT MODE
        </button>
        {sidebarLinks.map((group, index) => (
          <div key={group.group} className="mb-4">
            {/* Group separator line instead of text label */}
            {index > 0 && <div className="mx-2 mb-3 h-px bg-gray-200" />}

            <div className="flex flex-col gap-1">
              {group.links.map(link => {
                const isActive = pathname.startsWith(link.path);
                return (
                  <Link
                    key={link.text}
                    to={link.path}
                    className={cn(
                      'flex flex-col items-center justify-center',
                      'rounded-lg px-2 py-3 text-sm font-medium transition-all duration-150',
                      'hover:bg-gray-100 hover:shadow-sm',
                      'active:translate-y-[1px] active:shadow-inner',
                      isActive
                        ? 'bg-white text-blue-600 shadow-md ring-1 ring-blue-300'
                        : 'text-gray-700 hover:text-gray-900',
                    )}
                    title={link.text} // Tooltip for accessibility
                  >
                    <link.icon className="mb-1 h-5 w-5" />
                    <span className="line-clamp-2 px-1 text-center text-xs leading-tight">
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
