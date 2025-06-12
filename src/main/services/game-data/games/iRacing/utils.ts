import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { Wetness } from "../../types/game-data";

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

      const raceJustStarted = telemetry.SessionTime < 130;
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

export function getTrackWetnessString(wetnessLevel: number): Wetness {
  const wetnessLevels: Record<number, Wetness> = {
    0: "",
    1: "Dry",
    2: "Mostly Dry",
    3: "Very Lightly Wet",
    4: "Lightly Wet",
    5: "Moderately Wet",
    6: "Very Wet",
    7: "Extremely Wet",
  };

  return wetnessLevels[wetnessLevel] ?? "";
}

export function getLapDistTotalPct(
  telemetry: TelemetryValues,
  carIdx: number,
): number | null {
  const lapCompleted = telemetry.CarIdxLapCompleted[carIdx];
  const lapDistPct = telemetry.CarIdxLapDistPct[carIdx];
  const totalPct = lapCompleted + lapDistPct;

  const result =
    telemetry.SessionTime < 130 && totalPct > 0.75
      ? (1 - totalPct) * -1
      : totalPct;

  return result > 0 ? result : null;
}

export function getCarIsOnTrack(telemetry: TelemetryValues, carIdx: number) {
  return telemetry.CarIdxTrackSurface[carIdx] !== "NotInWorld";
}

type DriverWithIRating = {
  id: number;
  position: number; // 1 = first place, 2 = second, etc.
  rating: number;
};

type iRatingChange = {
  id: number;
  ratingChange: number;
};

export function calculateIRatingChanges(
  drivers: DriverWithIRating[],
): iRatingChange[] {
  const iRatingChanges: iRatingChange[] = [];
  const magicNumber = 2308.087; // Equivalent to 1600 / ln(2)
  const driverCount = drivers.length;

  // Precompute exponentials to avoid redundant calculations
  const expMap = new Map<number, number>();
  const oneMinusExpMap = new Map<number, number>();

  for (const driver of drivers) {
    const rating = driver.rating;
    if (!expMap.has(rating)) {
      const expVal = Math.exp(-rating / magicNumber);
      expMap.set(rating, expVal);
      oneMinusExpMap.set(rating, 1 - expVal);
    }
  }

  for (const driver of drivers) {
    const currentRating = driver.rating;
    const currentPosition = driver.position;

    const expCurrent = expMap.get(currentRating);
    const oneMinusExpCurrent = oneMinusExpMap.get(currentRating);

    if (expCurrent === undefined || oneMinusExpCurrent === undefined) continue;

    let expectedScore = -0.5;

    for (const opponent of drivers) {
      const opponentRating = opponent.rating;

      const expOpponent = expMap.get(opponentRating);
      const oneMinusExpOpponent = oneMinusExpMap.get(opponentRating);

      if (expOpponent === undefined || oneMinusExpOpponent === undefined)
        continue;

      const numerator = oneMinusExpCurrent * expOpponent;
      const denominator =
        oneMinusExpOpponent * expCurrent + oneMinusExpCurrent * expOpponent;

      expectedScore += numerator / denominator;
    }

    const fudgeFactor = (driverCount / 2 - currentPosition) / 100;
    const ratingDelta =
      ((driverCount - currentPosition - expectedScore - fudgeFactor) * 200) /
      driverCount;

    iRatingChanges.push({
      id: driver.id,
      ratingChange: Math.round(ratingDelta),
    });
  }

  return iRatingChanges;
}
