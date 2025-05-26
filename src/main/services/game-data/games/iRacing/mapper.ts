import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { SpeedConverter } from "../../utils/SpeedConverter";
import { iracingSteeringAngleToPercents } from "../../utils/iracingSteeringAngleToPercents";
import { DriverElement, MappedGameData } from "../../types/GameData";
import { calculateDistancesAndSort, mapDriverData } from "./utils";

export function mapDataFromIRacing(
  c: boolean,
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): MappedGameData {
  const driversRaw = sessionInfo.DriverInfo.Drivers;
  const { positionMap, classPositionMap } = calculateDistancesAndSort(
    telemetry,
    driversRaw,
  );

  const drivers: DriverElement[] = [];
  for (let i = 0; i < driversRaw.length; i++) {
    const driver = mapDriverData(
      i,
      driversRaw[i],
      telemetry,
      positionMap,
      classPositionMap,
    );
    if (driver) drivers.push(driver);
  }

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
    drivers,
    session: {
      trackName: sessionInfo.WeekendInfo.TrackName,
    },
  };
}
