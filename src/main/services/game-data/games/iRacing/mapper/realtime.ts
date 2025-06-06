import { TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { RealtimeGameData } from "../../../types/GameData";
import { SpeedConverter } from "@/main/utils/speedConverter";
import { iracingSteeringAngleToPercents } from "@/main/utils/iracingSteeringAngleToPercents";

export default function getRealtimeFields(
  telemetry: TelemetryValues,
): RealtimeGameData {
  return {
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
  };
}
