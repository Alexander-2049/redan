import IRacingSDK from "iracing-sdk-2025";
import {
  SessionInfoData,
  SessionInfoEvent,
  TelemetryEvent,
  TelemetryValues,
} from "iracing-sdk-2025/src/JsIrSdk";

const iracingClient = IRacingSDK.init({
  telemetryUpdateInterval: 1000 / 60,
  sessionInfoUpdateInterval: 1000 / 60,
});

const data: {
  connected: boolean;
  telemetry?: TelemetryValues;
  sessionInfo?: SessionInfoData;
} = {
  connected: false,
};

iracingClient.addListener("Telemetry", (telemetryEvent: TelemetryEvent) => {
  console.log("Telemetry received", telemetryEvent.data.Throttle);
  data.telemetry = telemetryEvent.data;
});

iracingClient.addListener(
  "SessionInfo",
  (sessionInfoEvent: SessionInfoEvent) => {
    console.log(
      "Session info received",
      sessionInfoEvent.data.DriverInfo.Drivers.length,
    );
    data.sessionInfo = sessionInfoEvent.data;
  },
);
