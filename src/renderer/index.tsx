import { useTranslation } from "react-i18next";
import "./i18n";
import useWebSocket from "./hooks/useWebSocket";
import { useEffect } from "react";
import TitleBar from "./components/TitleBar";

const Main = () => {
  const { t } = useTranslation();

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
      <TitleBar />
      The title is: {t("title")}
      Description: {t("description.part1")}
      <br />
      <pre>
        <code>{JSON.stringify(data, null, "  ")}</code>
      </pre>
    </>
  );
};

export default Main;
