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
    distance: number;
  }[] = [];

  for (const driver of sessionInfo.DriverInfo.Drivers) {
    const carIdx = driver.CarIdx;
    const classId = driver.CarClassID;
    const isCarOnTrack = telemetry.CarIdxTrackSurface[carIdx] !== "NotInWorld";

    if (!isCarOnTrack) {
      // Save positions directly
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
      const distance =
        telemetry.CarIdxLapCompleted[carIdx] +
        telemetry.CarIdxLapDistPct[carIdx];
      onTrackDrivers.push({ carIdx, classId, distance });
    }
  }

  // Sort on-track drivers by distance (descending)
  onTrackDrivers.sort((a, b) => b.distance - a.distance);

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

  for (let i = 0; i < sessionInfo.DriverInfo.Drivers.length; i++) {
    const driver = sessionInfo.DriverInfo.Drivers[i];
    const name = parseDriverName(driver.UserName);

    // console.log(sessionInfo.SessionInfo.Sessions);

    const livePosition = calculateDriversLivePositions(telemetry, sessionInfo);

    drivers.push({
      firstName: name.firstName,
      lastName: name.lastName,
      middleName: name.middleName,
      lapDistPct: telemetry.CarIdxLapDistPct[i],
      lapDistTotalPct:
        telemetry.CarIdxLapCompleted[i] + telemetry.CarIdxLapDistPct[i],
      position: livePosition.get(driver.CarIdx)?.position || 0,
      classPosition: livePosition.get(driver.CarIdx)?.classPosition || 0,
      isCarOnTrack:
        telemetry.CarIdxTrackSurface[driver.CarIdx] !== "NotInWorld",
    });
  }

  return drivers;
}
