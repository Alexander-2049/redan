import { useLayouts } from "../api/layouts/get-layouts";
import { useOverlays } from "../api/overlays/get-overlays";
import LayoutList from "../components/my-layouts/layout-list";
import LayoutSettings from "../components/my-layouts/layout-settings";
import OverlaysList from "../components/my-layouts/overlays-list";

const MyLayoutsRoute = () => {
  const layouts = useLayouts();
  const overlays = useOverlays();

  return (
    <div className="grid h-full grid-cols-[auto_1fr_auto]">
      {layouts.isLoading || overlays.isLoading ? null : (
        <>
          <LayoutList />
          <OverlaysList />
          <LayoutSettings />
        </>
      )}
    </div>
  );
};

export default MyLayoutsRoute;
