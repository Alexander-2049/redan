import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import getRealtimeFields from "./realtime";
import getDriversFields from "./drivers";
import getSessionFields from "./session";
import { IRacingData } from "./schema";

export function mapDataFromIRacing(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): IRacingData {
  return {
    game: "iRacing",
    realtime: getRealtimeFields(telemetry),
    drivers: getDriversFields(telemetry, sessionInfo),
    session: getSessionFields(telemetry, sessionInfo),
  };
}
