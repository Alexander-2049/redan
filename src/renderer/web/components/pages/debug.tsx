import { useGameAPIEvents } from "../../hooks/useGameAPIEvents";

const Debug = () => {
  const { controls, rpm, speed, carLocation, gear } = useGameAPIEvents([
    "controls",
    "rpm",
    "speed",
    "carLocation",
    "gear",
  ]);

  return (
    <div>
      <pre>{JSON.stringify(controls, undefined, " ")}</pre>
      <pre>{JSON.stringify(rpm, undefined, " ")}</pre>
      <pre>{JSON.stringify(gear, undefined, " ")}</pre>
      <pre>{JSON.stringify(speed, undefined, " ")}</pre>
      <pre>{JSON.stringify(carLocation, undefined, " ")}</pre>
    </div>
  );
};

export default Debug;
