import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { DriverElement } from "../../types/GameData";

export function parseDriverName(fullName: string) {
  const parts = fullName.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts[parts.length - 1] || "";
  const middleName = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

  return { firstName, middleName, lastName };
}

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
    const isCarOnTrack = telemetry.CarIdxTrackSurface[carIdx] !== "NotInWorld";
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

      const raceJustStarted = telemetry.SessionTime < 120 + 25;
      let lapDistTotalPct =
        telemetry.CarIdxLapCompleted[carIdx] +
        telemetry.CarIdxLapDistPct[carIdx];
      if (
        raceJustStarted &&
        telemetry.CarIdxLapCompleted[carIdx] +
          telemetry.CarIdxLapDistPct[carIdx] >
          0.75
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

export function mapDriversData(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): DriverElement[] {
  const drivers: DriverElement[] = [];
  const livePosition = calculateDriversLivePositions(telemetry, sessionInfo);

  for (let i = 0; i < sessionInfo.DriverInfo.Drivers.length; i++) {
    const driver = sessionInfo.DriverInfo.Drivers[i];
    if (driver.CarIsPaceCar) continue;

    const name = parseDriverName(driver.UserName);

    const raceJustStarted = telemetry.SessionTime < 120 + 25;
    let lapDistTotalPct =
      telemetry.CarIdxLapCompleted[i] + telemetry.CarIdxLapDistPct[i];
    if (
      raceJustStarted &&
      telemetry.CarIdxLapCompleted[i] + telemetry.CarIdxLapDistPct[i] > 0.75
    ) {
      lapDistTotalPct = (1 - lapDistTotalPct) * -1;
    }

    drivers.push({
      carId: driver.CarIdx,
      firstName: name.firstName,
      lastName: name.lastName,
      middleName: name.middleName,
      lapDistPct: telemetry.CarIdxLapDistPct[i],
      lapDistTotalPct,
      position: livePosition.get(driver.CarIdx)?.position || 0,
      classPosition: livePosition.get(driver.CarIdx)?.classPosition || 0,
      isCarOnTrack:
        telemetry.CarIdxTrackSurface[driver.CarIdx] !== "NotInWorld",
    });
  }

  return drivers;
}
