import { useState, useEffect, useMemo } from "react";

import { WEBSOCKET_SERVER_PORT } from "../../../../shared/constants";
import { GameAPI } from "../../utils/GameAPI";

const DashboardPage = () => {
  const api = useMemo(() => new GameAPI(WEBSOCKET_SERVER_PORT), []);
  const [controls, setControls] = useState(null);

  useEffect(() => {
    const callback = (data: unknown) => {
      setControls(data);
    };

    api.addEventListener("controls", callback);
    return () => {
      api.removeEventListener("controls", callback);
    };
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(controls, undefined, " ")}</pre>
    </div>
  );
};

export default DashboardPage;
