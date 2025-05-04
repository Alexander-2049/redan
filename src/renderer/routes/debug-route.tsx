import useWebSocket from "../hooks/useWebSocket";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { increment } from "../slices/exampleSlice";

const DebugRoute = () => {
  const value = useSelector((state: RootState) => state.example.value);
  const dispatch = useDispatch();

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
      <div>
        <p>Value: {value}</p>
        <button onClick={() => dispatch(increment())}>+1</button>
      </div>
    </>
  );
};

export default DebugRoute;
