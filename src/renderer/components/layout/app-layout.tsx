import { Outlet } from "react-router-dom";
import TitleBar from "../title-bar";
import Header from "../header";

function Layout() {
  return (
    <div className="grid h-full grid-rows-[auto_auto_1fr] overflow-hidden">
      <TitleBar />
      <Header />
      <div className="overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
