import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <>
      <Header />
      <div className="flex h-0 grow flex-col">
        <div className="flex h-full grow flex-row">
          <Sidebar />
          <div className="grow overflow-hidden">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default PageLayout;
