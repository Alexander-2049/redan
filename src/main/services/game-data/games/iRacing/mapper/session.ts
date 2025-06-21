import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { getTrackWetnessString } from "../utils";
import { IRacingSessionData } from "./schema";

export default function getSessionFields(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): IRacingSessionData {
  return {
    trackName: sessionInfo.WeekendInfo.TrackName,
    wetnessString: getTrackWetnessString(telemetry.TrackWetness),
    wetnessLevel: telemetry.TrackWetness,
    trackTempC: Math.floor(telemetry.TrackTemp * 100) / 100,
    trackTempF: Math.floor(((telemetry.TrackTemp * 9) / 5 + 32) * 100) / 100,
    airTempC: Math.floor(telemetry.AirTemp * 100) / 100,
    airTempF: Math.floor(((telemetry.AirTemp * 9) / 5 + 32) * 100) / 100,
    trackTempCString: telemetry.TrackTemp
      ? `${telemetry.TrackTemp.toFixed(0)}°C`
      : "0",
    trackTempFString: telemetry.TrackTemp
      ? `${((telemetry.TrackTemp * 9) / 5 + 32).toFixed(0)}°F`
      : "0",
    airTempCString: telemetry.AirTemp
      ? `${telemetry.AirTemp.toFixed(0)}°C`
      : "0",
    airTempFString: telemetry.AirTemp
      ? `${((telemetry.AirTemp * 9) / 5 + 32).toFixed(0)}°F`
      : "0",
  };
}
