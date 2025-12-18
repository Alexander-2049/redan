import { TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

export function getIsCarOnTrack(telemetry: TelemetryValues, carIdx: number) {
  return telemetry.CarIdxTrackSurface[carIdx] === 'OnTrack';
}
