import { TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

export function getLapDistTotalPct(telemetry: TelemetryValues, carIdx: number): number | null {
  const lapCompleted = telemetry.CarIdxLapCompleted[carIdx];
  const lapDistPct = telemetry.CarIdxLapDistPct[carIdx];
  const totalPct = lapCompleted + lapDistPct;

  const result = telemetry.SessionTime < 130 && totalPct > 0.75 ? (1 - totalPct) * -1 : totalPct;

  return result > 0 ? result : null;
}
