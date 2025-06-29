import { LucideIcon } from 'lucide-react';
import { Outlet } from 'react-router-dom';

import Sidebar from '../SideBar';

interface SidebarLink {
  text: string;
  path: string;
  icon: LucideIcon;
}

interface SidebarLinkGroup {
  group: string;
  links: SidebarLink[];
}

interface PageLayoutProps {
  sidebarLinks: SidebarLinkGroup[];
}

export const PageLayout = ({ sidebarLinks }: PageLayoutProps) => {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar sidebarLinks={sidebarLinks} />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
