import { TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

export function getCarIsOnTrack(telemetry: TelemetryValues, carIdx: number) {
  return telemetry.CarIdxTrackSurface[carIdx] !== 'NotInWorld';
}
