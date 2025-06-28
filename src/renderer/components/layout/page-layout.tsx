import { Outlet } from 'react-router-dom';

import Sidebar from '../side-bar';

const PageLayout = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};

export default PageLayout;
