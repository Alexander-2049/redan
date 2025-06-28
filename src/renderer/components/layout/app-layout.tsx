import { Outlet } from 'react-router-dom';

import TitleBar from '../title-bar';

function Layout() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      <TitleBar />
      <div className="flex flex-1 overflow-hidden">
        <div className="min-h-0 flex-1 overflow-hidden">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default Layout;
