import { Outlet } from "react-router-dom";
import TitleBar from "../title-bar";

function Layout() {
  return (
    <div className="flex h-full flex-col">
      <TitleBar />
      <Outlet />
    </div>
  );
}

export default Layout;
