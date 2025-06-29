import { Outlet } from 'react-router-dom';

import Sidebar from '../SideBar';

export const PageLayout = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar isDebug={true} />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
