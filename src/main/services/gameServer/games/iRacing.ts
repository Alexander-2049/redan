import IRacingSDK from "iracing-sdk-2025";
import {
  SessionInfoData,
  SessionInfoEvent,
  TelemetryEvent,
  TelemetryValues,
} from "iracing-sdk-2025/src/JsIrSdk";
import { GameDataStreamer } from "../GameDataStreamer";
import { mapDataFromIRacing } from "../mapGameData";

const iracingClient = IRacingSDK.init({
  telemetryUpdateInterval: 1000 / 60,
  sessionInfoUpdateInterval: 1000 / 60,
});

export const iracingStreamer = new GameDataStreamer();

const data: {
  connected: boolean;
  telemetry?: TelemetryValues;
  sessionInfo?: SessionInfoData;
} = {
  connected: false,
};

iracingClient.addListener("Telemetry", (telemetryEvent: TelemetryEvent) => {
  data.telemetry = telemetryEvent.data;
  if (!data.telemetry || !data.sessionInfo) return;

  iracingStreamer.updateGameData(
    mapDataFromIRacing(true, data.telemetry, data.sessionInfo),
  );
});

iracingClient.addListener(
  "SessionInfo",
  (sessionInfoEvent: SessionInfoEvent) => {
    data.sessionInfo = sessionInfoEvent.data;
  },
);
