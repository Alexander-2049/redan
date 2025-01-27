import { TelemetryInterface } from "../shared/types/telemetry";
import { iRacingSDK } from "./games/iracing/iRacingSDK";
import { GamesWebSocketServerAPI } from "./models/GamesWebSocketServerAPI";
import { formatTelemetryData } from "./utils/formatTelemetryData";
import { SessionInfo } from "../shared/types/sessionInfo";

export const irsdkipc = new iRacingSDK();

export const gamesWebSocketServerAPI = new GamesWebSocketServerAPI();

const iracingData: {
  telemetry: TelemetryInterface;
  sessionInfo: SessionInfo;
} = {
  telemetry: null,
  sessionInfo: null,
};

irsdkipc.on("sessionInfo", (sessionInfo) => {
  if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
  iracingData.sessionInfo = sessionInfo.data;

  gamesWebSocketServerAPI.groups.sessionInfo.send(sessionInfo.data);
});

irsdkipc.on("telemetry", (telemetry) => {
  if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
  iracingData.telemetry = telemetry.data;

  const formattedTelemetryData = formatTelemetryData(telemetry.data);

  gamesWebSocketServerAPI.groups.telemetry.send(telemetry.data);
  gamesWebSocketServerAPI.groups.rpm.send(formattedTelemetryData.rpm);
  gamesWebSocketServerAPI.groups.controls.send(formattedTelemetryData.controls);
  gamesWebSocketServerAPI.groups.speed.send(formattedTelemetryData.speed);
  gamesWebSocketServerAPI.groups.state.send(formattedTelemetryData.state);
});

// TODO ??
// irsdkipc.on("connected", (connected) => {
//   if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
// });

// irsdkipc.on("close", () => {
//   if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
// });

// irsdkipc.on("spawn", () => {
//   if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
// });
