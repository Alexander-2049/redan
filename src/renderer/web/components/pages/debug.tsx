import { useState, useEffect, useMemo } from "react";

import { WEBSOCKET_SERVER_PORT } from "../../../../shared/constants";
import { GameAPI } from "../../utils/GameAPI";

    // controls: new ConnectedListeners(),
    // rpm: new ConnectedListeners(),
    // speed: new ConnectedListeners(),
    // "carLocation": new ConnectedListeners(),

const Debug = () => {
  const api = useMemo(() => new GameAPI(WEBSOCKET_SERVER_PORT), []);
  const [controls, setControls] = useState(null);
  const [rpm, setRpm] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [carLocation, setCarLocation] = useState(null);

  useEffect(() => {
    api.addEventListener("controls", setControls);
    api.addEventListener("rpm", setRpm);
    api.addEventListener("speed", setSpeed);
    api.addEventListener("carLocation", setCarLocation);

    return () => {
      api.removeEventListener("controls", setControls);
      api.removeEventListener("rpm", setControls);
      api.removeEventListener("speed", setControls);
      api.removeEventListener("carLocation", setControls);
    };
  }, []);

  return (
    <div>
      <pre>{JSON.stringify(controls, undefined, " ")}</pre>
      <pre>{JSON.stringify(rpm, undefined, " ")}</pre>
      <pre>{JSON.stringify(speed, undefined, " ")}</pre>
      <pre>{JSON.stringify(carLocation, undefined, " ")}</pre>
    </div>
  );
};

export default Debug;