import { TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

export function getIsCarInWorld(telemetry: TelemetryValues, carIdx: number) {
  return telemetry.CarIdxTrackSurface[carIdx] !== 'NotInWorld';
}
