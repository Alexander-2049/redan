import { Outlet } from "react-router-dom";
import TitleBar from "../title-bar";

function Layout() {
  return (
    <div className="grid h-full grid-rows-[auto_1fr] overflow-hidden">
      <TitleBar />
      <div className="overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
