import { SessionInfoData, TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

interface Position {
  position: number;
  classPosition: number;
}

export function calculateDriversLivePositions(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): Map<number, Position> {
  const positions: Map<number, Position> = new Map();
  const notOnTrackPositions: number[] = [];
  const notOnTrackClassPositions: Map<number, number[]> = new Map(); // Map<classId, carIdx[]>
  const onTrackDrivers: {
    carIdx: number;
    classId: number;
    totalDistance: number;
  }[] = [];

  for (const driver of sessionInfo.DriverInfo.Drivers) {
    const carIdx = driver.CarIdx;
    const classId = driver.CarClassID;
    const isCarOnTrack = telemetry.CarIdxTrackSurface[carIdx] !== 'NotInWorld';
    const isPaceCar = driver.CarIsPaceCar;

    if (isPaceCar) continue;

    if (!isCarOnTrack) {
      positions.set(carIdx, {
        position: telemetry.CarIdxPosition[carIdx],
        classPosition: telemetry.CarIdxClassPosition[carIdx],
      });

      notOnTrackPositions.push(telemetry.CarIdxPosition[carIdx]);

      if (!notOnTrackClassPositions.has(classId)) {
        notOnTrackClassPositions.set(classId, []);
      }
      const classPositions = notOnTrackClassPositions.get(classId);
      if (classPositions) {
        classPositions.push(telemetry.CarIdxClassPosition[carIdx]);
      }
    } else {
      // Calculate distance traveled

      const raceJustStarted = telemetry.SessionTime < 130;
      let lapDistTotalPct =
        telemetry.CarIdxLapCompleted[carIdx] + telemetry.CarIdxLapDistPct[carIdx];
      if (
        raceJustStarted &&
        telemetry.CarIdxLapCompleted[carIdx] + telemetry.CarIdxLapDistPct[carIdx] > 0.75
      ) {
        lapDistTotalPct = (1 - lapDistTotalPct) * -1;
      }

      onTrackDrivers.push({ carIdx, classId, totalDistance: lapDistTotalPct });
    }
  }

  // Sort on-track drivers by distance (descending)
  onTrackDrivers.sort((a, b) => b.totalDistance - a.totalDistance);

  // Assign positions to on-track drivers
  const availablePositions: number[] = [];
  for (let pos = 1; pos <= sessionInfo.DriverInfo.Drivers.length; pos++) {
    if (!notOnTrackPositions.includes(pos)) {
      availablePositions.push(pos);
    }
  }

  for (let i = 0; i < onTrackDrivers.length; i++) {
    const { carIdx, classId } = onTrackDrivers[i];

    // Assign global position
    const position = availablePositions[i];

    // Assign class position
    const takenClassPositions = notOnTrackClassPositions.get(classId) ?? [];
    let classPos = 1;
    while (takenClassPositions.includes(classPos)) {
      classPos++;
    }
    takenClassPositions.push(classPos);
    notOnTrackClassPositions.set(classId, takenClassPositions);

    positions.set(carIdx, {
      position,
      classPosition: classPos,
    });
  }

  return positions;
}
