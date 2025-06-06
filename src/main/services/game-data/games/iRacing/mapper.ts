import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { MappedGameData } from "../../types/GameData";
import getRealtimeFields from "./mapper/realtime";
import getDriversFields from "./mapper/drivers";
import getSessionFields from "./mapper/session";

export function mapDataFromIRacing(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): MappedGameData {
  return {
    game: "iRacing",
    realtime: getRealtimeFields(telemetry),
    drivers: getDriversFields(telemetry, sessionInfo),
    session: getSessionFields(telemetry, sessionInfo),
  };
}
