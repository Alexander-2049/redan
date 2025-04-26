import useWebSocket from "../hooks/useWebSocket";
import { useEffect } from "react";

const DebugRoute = () => {
  const { data, error } = useWebSocket("ws://localhost:49791", [
    "realtime.throttle",
    "realtime.brake",
  ]);

  useEffect(() => {
    if (error) {
      console.error("WebSocket Error:", error);
    }

    console.log("WebSocket Data:", data);
  }, [data, error]);

  return (
    <>
      <pre>
        <code>{JSON.stringify(data, null, "  ")}</code>
      </pre>
    </>
  );
};

export default DebugRoute;
