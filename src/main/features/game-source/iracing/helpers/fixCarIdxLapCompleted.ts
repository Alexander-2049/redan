import { TelemetryEvent } from 'iracing-sdk-2025/src/JsIrSdk';

/*
 * ========================================================================================
 * This is a bug fix for incoming data from iRacing
 * For some reason Laps Completed field can update earlier, than a driver has completed lap
 * So this fix reverts lap back, if in previous tick Laps Completed was different
 * This function affects realtime position calculation
 * ========================================================================================
 */
const lastTickLapsCompleted = new Map<
  number,
  {
    lapsCompleted: number;
    lapDist: number;
  }
>();

export function fixCarIdxLapCompleted(telemetry: TelemetryEvent): void {
  for (let i = 0; i < telemetry.data.CarIdxLapCompleted.length; i++) {
    const lapsCompleted = telemetry.data.CarIdxLapCompleted[i];
    const lapDist = telemetry.data.CarIdxLapDistPct[i];
    const lastTick = lastTickLapsCompleted.get(i);

    // First time seeing this car
    if (!lastTick) {
      lastTickLapsCompleted.set(i, { lapsCompleted, lapDist });
      continue;
    }

    // Skip if both values are unchanged (repeated call within same state)
    if (lastTick.lapsCompleted === lapsCompleted && lastTick.lapDist === lapDist) {
      continue;
    }

    const lapCompletedAdvanced = lapsCompleted > lastTick.lapsCompleted;
    const lapDistNotReset = lapDist > 0.05; // assume 0..1 lapDistPct, with ~0 meaning new lap

    // If lapsCompleted increased, but lapDist hasn't wrapped, it's likely premature
    if (lapCompletedAdvanced && lapDistNotReset) {
      telemetry.data.CarIdxLapCompleted[i] = lapsCompleted - 1;
      // Don't update lastTick yet — wait for lapDist to reset to ~0 before accepting new lap
      continue;
    }

    // Accept new values
    lastTickLapsCompleted.set(i, { lapsCompleted, lapDist });
  }
}
