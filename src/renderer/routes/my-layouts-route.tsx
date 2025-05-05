import LayoutList from "../components/my-layouts/layout-list";
import LayoutSettings from "../components/my-layouts/layout-settings";
import OverlaysList from "../components/my-layouts/overlays-list";

const MyLayoutsRoute = () => {
  return (
    <div className="grid h-full grid-cols-[auto_1fr_auto]">
      <LayoutList />
      <OverlaysList />
      <LayoutSettings />
    </div>
  );
};

export default MyLayoutsRoute;
