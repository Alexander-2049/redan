import { useEffect, useState } from "react";
import Layout from "./components/layout";
import { GameAPI } from "./utils/GameAPI";
import { WEBSOCKET_SERVER_PORT } from "../../shared/constants";
import Menu from "./components/menu";
// import useLocationHash from "./hooks/useLocationHash";

const Main = () => {
  const [api] = useState(new GameAPI(WEBSOCKET_SERVER_PORT));
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
    <Layout>
      <Menu />
      <pre>{JSON.stringify(controls, undefined, " ")}</pre>
    </Layout>
  );
};

export default Main;
