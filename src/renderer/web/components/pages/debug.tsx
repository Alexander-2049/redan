import { useGameAPIEvents } from "../../hooks/useGameAPIEvents";
import { useEffect, useState } from "react";

const Debug = () => {
  const api = useGameAPIEvents([
    "controls",
    "rpm",
    "speed",
    "carLocation",
    "gear",
  ]);
  const [apiCopy, setApiCopy] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  useEffect(() => {
    if (!isPaused) setApiCopy(JSON.parse(JSON.stringify(api)));
  }, [api]);

  return (
    <div>
      <textarea
        cols={60}
        rows={45}
        value={JSON.stringify(apiCopy, undefined, " ")}
        readOnly={true}
      />
      <button
        style={{ display: "block" }}
        onClick={() => {
          setIsPaused((prev) => !prev);
        }}
      >
        {isPaused ? "Unpause" : "Pause"}
      </button>
    </div>
  );
};

export default Debug;
