import { IOverlay } from "@/shared/types/IOverlay";
import { useEffect, useState } from "react";

const MyOverlaysRoute = () => {
  const [overlayList, setOverlayList] = useState<IOverlay[]>([]);

  useEffect(() => {
    window.electron
      .getOverlayList()
      .then((data) => setOverlayList(data))
      .catch((error) => console.error(error));
  }, []);

  return <pre>{JSON.stringify(overlayList, null, "  ")}</pre>;
};

export default MyOverlaysRoute;
