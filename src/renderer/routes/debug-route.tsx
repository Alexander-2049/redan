import { useEffect, useState } from "react";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import useWebSocket from "../hooks/useWebSocket";
import { ClickableSchemaViewer } from "../components/clickable-schema-view";
// import { useSelector, useDispatch } from "react-redux";
// import { RootState } from "../store";
// import { increment } from "../slices/exampleSlice";

const DebugRoute = () => {
  // const value = useSelector((state: RootState) => state.example.value);
  // const dispatch = useDispatch();

  const { data } = useWebSocket(["game", "session", "drivers", "realtime"]);
  const [isRecording, setIsRecording] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [shape, setShape] = useState<string | null>(null);

  useEffect(() => {
    window.electron
      .getGameDataShape("iRacing")
      .then((e) => setShape(JSON.stringify(e)));
  }, []);

  if (!shape) return;
  return (
    <>
      <ScrollArea className="h-full">
        <pre>
          <ClickableSchemaViewer schema={JSON.parse(shape)} />
        </pre>
        {isRecording ? (
          <Button
            onClick={() => {
              setIsRecording(false);
              window.electron.stopRecordDemo();
            }}
          >
            Stop recording
          </Button>
        ) : (
          <Button
            onClick={() => {
              setIsRecording(true);
              window.electron.recordDemo();
            }}
          >
            Record replay
          </Button>
        )}
        <pre>
          <code>{JSON.stringify(data, null, "  ")}</code>
        </pre>
        <input
          type="file"
          accept=".html"
          onChange={(e) => {
            console.log(e.target.files && e.target.files[0]?.path);
          }}
        />
      </ScrollArea>
      {/* <div>
        <p>Value: {value}</p>
        <button onClick={() => dispatch(increment())}>+1</button>
      </div> */}
    </>
  );
};

export default DebugRoute;
