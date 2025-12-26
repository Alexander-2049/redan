const prevLapDistPctMap: Map<
  number,
  { lapDistPct: number; sessionTime: number; speedKph: number }
> = new Map();

export function getCarSpeedKph(
  carIdx: number,
  lapDistPct: number,
  trackLengthMeters: number,
  sessionTime: number,
): number {
  const prevData = prevLapDistPctMap.get(carIdx);

  if (!prevData) {
    prevLapDistPctMap.set(carIdx, {
      lapDistPct,
      sessionTime,
      speedKph: 0,
    });
    return 0;
  }

  const rawTimeDelta = sessionTime - prevData.sessionTime;
  const timeDeltaSeconds = Math.abs(rawTimeDelta);

  if (timeDeltaSeconds < 0.15) {
    return prevData.speedKph;
  }

  const isReverse = rawTimeDelta < 0;

  let lapDistPctDelta = lapDistPct - prevData.lapDistPct;

  if (isReverse) {
    if (lapDistPctDelta > 0) lapDistPctDelta -= 1;
  } else {
    if (lapDistPctDelta < 0) lapDistPctDelta += 1;
  }

  lapDistPctDelta = Math.abs(lapDistPctDelta);

  if (lapDistPctDelta > 0.3) {
    prevLapDistPctMap.set(carIdx, {
      lapDistPct,
      sessionTime,
      speedKph: 0,
    });
    return 0;
  }

  const distanceMeters = lapDistPctDelta * trackLengthMeters;

  const speedKph = (distanceMeters / timeDeltaSeconds) * 3.6;

  if (speedKph > 500) {
    return prevData.speedKph;
  }

  prevLapDistPctMap.set(carIdx, {
    lapDistPct,
    sessionTime,
    speedKph,
  });

  return speedKph;
}
