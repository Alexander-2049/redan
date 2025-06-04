import { useState } from "react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import useWebSocket from "../hooks/useWebSocket";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store";
// import { increment } from "../slices/exampleSlice";

const DebugRoute = () => {
  // const value = useSelector((state: RootState) => state.example.value);
  // const dispatch = useDispatch();

  const { data } = useWebSocket(["session", "drivers", "realtime"]);
  const [isRecording, setIsRecording] = useState(false);

  return (
    <>
      <ScrollArea className="h-full">
        {isRecording ? (
          <Button
            onClick={() => {
              setIsRecording(false);
              window.electron.recordDemo();
            }}
          >
            Stop recording
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIsRecording(true);
              window.electron.stopRecordDemo();
            }}
          >
            Record replay
          </Button>
        )}
        <pre>
          <code>{JSON.stringify(data, null, "  ")}</code>
        </pre>
      </ScrollArea>
      {/* <div>
        <p>Value: {value}</p>
        <button onClick={() => dispatch(increment())}>+1</button>
      </div> */}
    </>
  );
};

export default DebugRoute;
