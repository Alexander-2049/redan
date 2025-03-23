import { z } from "zod";
import { telemetrySchema } from "../../shared/schemas/telemetrySchema";
import { dataSpeedSchema } from "../types/GamesAPI";
import { iracingSteeringAngleToPercents } from "./iracingSteeringAngleToPercents";
import { SpeedConverter } from "./speedConverter";

export function formatTelemetryData(
  telemetry: z.infer<typeof telemetrySchema>,
) {
  const speed: z.infer<typeof dataSpeedSchema> = {
    displayUnits: telemetry.DisplayUnits === 0 ? "IMPERIAL" : "METRIC",
    speedKph:
      Math.floor(
        SpeedConverter.convert(
          telemetry.Speed,
          "METERS_PER_SECOND",
          "KILOMETERS_PER_HOUR",
        ) * 100,
      ) / 100,
    speedMph:
      Math.floor(
        SpeedConverter.convert(
          telemetry.Speed,
          "METERS_PER_SECOND",
          "MILES_PER_HOUR",
        ) * 100,
      ) / 100,
  };

  return {
    rpm: {
      green: telemetry.PlayerCarSLFirstRPM,
      orange: telemetry.PlayerCarSLShiftRPM,
      red: telemetry.PlayerCarSLLastRPM,
      max: telemetry.PlayerCarSLBlinkRPM,
      rpm: Math.floor(telemetry.RPM),
    },
    controls: {
      brake: Math.floor(telemetry.Brake * 1000) / 1000,
      clutch: telemetry.Clutch,
      steeringAnglePercents:
        Math.floor(
          iracingSteeringAngleToPercents(telemetry.SteeringWheelAngle * -1) *
            1000,
        ) / 1000,
      steeringAnglePercentsMax:
        Math.floor(
          iracingSteeringAngleToPercents(telemetry.SteeringWheelAngleMax) * 100,
        ) / 100,
      throttle: Math.floor(telemetry.Throttle * 1000) / 1000,
      gear: telemetry.Gear,
    },
    speed: speed,
    state: {
      isInGarage: telemetry.IsInGarage,
      isOnPitLane: telemetry.OnPitRoad,
      isOnTrack: telemetry.IsOnTrack,
    },
  };
}
