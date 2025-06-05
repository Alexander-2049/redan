import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { SpeedConverter } from "../../utils/SpeedConverter";
import { iracingSteeringAngleToPercents } from "../../utils/iracingSteeringAngleToPercents";
import { MappedGameData } from "../../types/GameData";
import { getTrackWetnessString, mapDriversData } from "./utils";

export function mapDataFromIRacing(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): MappedGameData {
  return {
    game: "iRacing",
    realtime: {
      throttle: telemetry.Throttle,
      brake: telemetry.Brake,
      steeringAnglePct: iracingSteeringAngleToPercents(
        telemetry.SteeringWheelAngle,
      ),
      gear: telemetry.Gear,
      speedKph: SpeedConverter.convert(
        telemetry.Speed,
        "METERS_PER_SECOND",
        "KILOMETERS_PER_HOUR",
      ),
      speedMph: SpeedConverter.convert(
        telemetry.Speed,
        "METERS_PER_SECOND",
        "MILES_PER_HOUR",
      ),
      rpm: telemetry.RPM,
      rpmStageFirst: telemetry.PlayerCarSLFirstRPM,
      rpmStageShift: telemetry.PlayerCarSLShiftRPM,
      rpmStageLast: telemetry.PlayerCarSLLastRPM,
      rpmStageBlink: telemetry.PlayerCarSLBlinkRPM,
      displayUnits: telemetry.DisplayUnits === 0 ? "IMPERIAL" : "METRIC",
      absActive: telemetry.BrakeABSactive,
      isOnTrack:
        telemetry.IsOnTrack || telemetry.PlayerTrackSurface !== "NotInWorld",
      isInReplay: telemetry.IsReplayPlaying && !telemetry.IsOnTrackCar,
      spectateCarId: telemetry.CamCarIdx,
    },
    drivers: mapDriversData(telemetry, sessionInfo),
    session: {
      trackName: sessionInfo.WeekendInfo.TrackName,
      wetnessString: getTrackWetnessString(telemetry.TrackWetness),
      wetnessLevel: telemetry.TrackWetness,
      trackTempC: telemetry.TrackTemp,
      trackTempF: (telemetry.TrackTemp * 9) / 5 + 32,
      airTempC: telemetry.AirTemp,
      airTempF: (telemetry.AirTemp * 9) / 5 + 32,
      trackTempCString: telemetry.TrackTemp
        ? `${telemetry.TrackTemp.toFixed(0)}°C`
        : null,
      trackTempFString: telemetry.TrackTemp
        ? `${((telemetry.TrackTemp * 9) / 5 + 32).toFixed(0)}°F`
        : null,
      airTempCString: telemetry.AirTemp
        ? `${telemetry.AirTemp.toFixed(0)}°C`
        : null,
      airTempFString: telemetry.AirTemp
        ? `${((telemetry.AirTemp * 9) / 5 + 32).toFixed(0)}°F`
        : null,
    },
  };
}
