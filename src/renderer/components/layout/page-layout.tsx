import Sidebar from "../side-bar";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <>
      <div className="flex h-full flex-col">
        <div className="flex h-full grow flex-row">
          <Sidebar />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default PageLayout;
