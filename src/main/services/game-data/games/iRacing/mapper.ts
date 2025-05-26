import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { SpeedConverter } from "../../utils/SpeedConverter";
import { iracingSteeringAngleToPercents } from "../../utils/iracingSteeringAngleToPercents";
import { MappedGameData } from "../../types/GameData";
import { mapDriversData } from "./utils";

export function mapDataFromIRacing(
  c: boolean,
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): MappedGameData {
  return {
    isConnected: c,
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
    },
    drivers: mapDriversData(telemetry, sessionInfo),
    session: {
      trackName: sessionInfo.WeekendInfo.TrackName,
    },
  };
}
