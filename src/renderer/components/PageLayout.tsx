import Header from "./Header";
import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { ScrollArea } from "./ui/scroll-area";

const PageLayout = () => {
  return (
    <>
      <Header />
      <div className="flex h-0 grow flex-col">
        <div className="flex h-full grow flex-row">
          <Sidebar />
          <ScrollArea className="overflow-y h-full grow bg-[#f5f5f5]">
            <Outlet />
          </ScrollArea>
        </div>
      </div>
    </>
  );
};

export default PageLayout;
