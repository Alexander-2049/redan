import { TelemetryInterface } from "../../shared/types/telemetry";
import { DataSpeed } from "../types/GamesAPI";
import { iracingSteeringAngleToPercents } from "./iracingSteeringAngleToPercents";
import { SpeedConverter } from "./speedConverter";

export function formatTelemetryData(telemetry: TelemetryInterface) {
  const speed: DataSpeed = {
    displayUnits: telemetry.DisplayUnits === 0 ? "IMPERIAL" : "METRIC",
    speedKph: SpeedConverter.convert(
      telemetry.Speed,
      "METERS_PER_SECOND",
      "KILOMETERS_PER_HOUR"
    ),
    speedMph: SpeedConverter.convert(
      telemetry.Speed,
      "METERS_PER_SECOND",
      "MILES_PER_HOUR"
    ),
  };

  return {
    rpm: {
      green: telemetry.PlayerCarSLFirstRPM,
      orange: telemetry.PlayerCarSLShiftRPM,
      red: telemetry.PlayerCarSLLastRPM,
      max: telemetry.PlayerCarSLBlinkRPM,
      rpm: telemetry.RPM,
    },
    controls: {
      brake: telemetry.Brake,
      clutch: telemetry.Clutch,
      steeringAnglePercents: iracingSteeringAngleToPercents(
        telemetry.SteeringWheelAngle
      ),
      steeringAnglePercentsMax: iracingSteeringAngleToPercents(
        telemetry.SteeringWheelAngleMax
      ),
      throttle: telemetry.Throttle,
    },
    speed: speed,
    carLocation: {
      isInGarage: telemetry.IsInGarage,
      isOnPitLane: telemetry.OnPitRoad,
      isOnTrack: telemetry.IsOnTrack,
    },
    gear: {
      gear: telemetry.Gear,
    },
  };
}
