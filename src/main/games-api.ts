import { z } from "zod";
import { iRacingSDK } from "./games/iracing/iRacingSDK";
import { GamesWebSocketServerAPI } from "./models/GamesWebSocketServerAPI";
import { formatTelemetryData } from "./utils/formatTelemetryData";
import { telemetrySchema } from "../shared/schemas/telemetrySchema";
import { sessionInfoSchema } from "../shared/schemas/sessionInfoSchema";

export const irsdkipc = new iRacingSDK();

export const gamesWebSocketServerAPI = new GamesWebSocketServerAPI();

const iracingData: {
  telemetry: z.infer<typeof telemetrySchema> | null;
  sessionInfo: z.infer<typeof sessionInfoSchema> | null;
} = {
  telemetry: null,
  sessionInfo: null,
};

let isGameConnected = false;

irsdkipc.on("sessionInfo", (sessionInfo) => {
  if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
  iracingData.sessionInfo = sessionInfo.data;

  if (sessionInfo.data === null) return;

  gamesWebSocketServerAPI.groups.sessionInfo.send(sessionInfo.data);
});

irsdkipc.on("telemetry", (telemetry) => {
  if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
  iracingData.telemetry = telemetry.data;

  if (telemetry.data === null) return;

  const formattedTelemetryData = formatTelemetryData(telemetry.data);

  gamesWebSocketServerAPI.groups.telemetry.send(telemetry.data);
  gamesWebSocketServerAPI.groups.rpm.send(formattedTelemetryData.rpm);
  gamesWebSocketServerAPI.groups.controls.send(formattedTelemetryData.controls);
  gamesWebSocketServerAPI.groups.speed.send(formattedTelemetryData.speed);
  gamesWebSocketServerAPI.groups.state.send(formattedTelemetryData.state);
});

irsdkipc.on("connected", (connected) => {
  if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
  isGameConnected = connected.data;

  gamesWebSocketServerAPI.groups.connected.send({
    isConnected: isGameConnected,
  });
});

// irsdkipc.on("close", () => {
//   if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
// });

// irsdkipc.on("spawn", () => {
//   if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
// });
