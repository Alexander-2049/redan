import { iRacingSDK } from "./games/iracing/iRacingSDK";
import { GamesWebSocketServerAPI } from "./models/GamesWebSocketServerAPI";
import { formatTelemetryData } from "./utils/formatTelemetryData";

export const irsdkipc = new iRacingSDK();

export const gamesWebSocketServerAPI = new GamesWebSocketServerAPI();

// irsdkipc.on("sessionInfo", (sessionInfo) => {
//   if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;
// });

irsdkipc.on("telemetry", (telemetry) => {
  if (gamesWebSocketServerAPI.getSelectedGame() !== "IRACING") return;

  const formattedTelemetryData = formatTelemetryData(telemetry.data);

  gamesWebSocketServerAPI.groups.rpm.send(formattedTelemetryData.rpm);
  gamesWebSocketServerAPI.groups.controls.send(formattedTelemetryData.controls);
  gamesWebSocketServerAPI.groups.speed.send(formattedTelemetryData.speed);
  gamesWebSocketServerAPI.groups.carLocation.send(formattedTelemetryData.carLocation);
  gamesWebSocketServerAPI.groups.gear.send(formattedTelemetryData.gear);
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
