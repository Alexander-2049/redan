import GameSelect from "../game-select";
import Sidebar from "../side-bar";
import { Outlet } from "react-router-dom";

const PageLayout = () => {
  return (
    <div className="flex h-full overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <GameSelect />
    </div>
  );
};

export default PageLayout;
