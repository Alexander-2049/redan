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
    const classGroups: Record<
      number,
      { id: number; position: number; rating: number }[]
    > = {};

    for (let i = 0; i < sessionInfo.DriverInfo.Drivers.length; i++) {
      const driver = sessionInfo.DriverInfo.Drivers[i];
      if (driver.CarIsPaceCar || driver.IsSpectator) continue;

      const classId = driver.CarClassID;
      const id = driver.CarIdx;
      const position = livePosition.get(driver.CarIdx)?.classPosition || 0;
      const rating = driver.IRating;

      if (!classGroups[classId]) {
        classGroups[classId] = [];
      }
      classGroups[classId].push({ id, position, rating });
    }

    const classArrays = Object.values(classGroups);

    const ratingChanges = classArrays.map((e) => {
      return calculateIRatingChanges(e);
    });

    const driver = sessionInfo.DriverInfo.Drivers[i];
    if (driver.CarIsPaceCar || driver.IsSpectator) continue;

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

    // Find the driver's class group and their iRating change
    const classId = driver.CarClassID;
    const iRatingChangeEntry = ratingChanges[
      Object.keys(classGroups).indexOf(classId.toString())
    ]?.find((e) => e.id === driver.CarIdx);

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
      iRating: driver.IRating,
      iRatingChange: iRatingChangeEntry ? iRatingChangeEntry.ratingChange : 0,
    });
  }

  return drivers;
}

/*
EXAMPLE USAGE

  console.log(
    calculateIRatingChanges([
      {
        id: 1,
        position: 1,
        rating: 2521, // EXPECTED +60
      },
      {
        id: 2,
        position: 2,
        rating: 1979, // EXPECTED +60
      },
      {
        id: 3,
        position: 3,
        rating: 1617, // EXPECTED +56
      },
      {
        id: 4,
        position: 4,
        rating: 1562, // EXPECTED +40
      },
      {
        id: 5,
        position: 5,
        rating: 1649, // EXPECTED +19
      },
      {
        id: 6,
        position: 6,
        rating: 1689, // EXPECTED -1
      },
      {
        id: 7,
        position: 7,
        rating: 1428, // EXPECTED -8
      },
      {
        id: 8,
        position: 8,
        rating: 1514, // EXPECTED -30
      },
      {
        id: 9,
        position: 9,
        rating: 1634, // EXPECTED -53
      },
      {
        id: 10,
        position: 10,
        rating: 1444, // EXPECTED -62
      },
      {
        id: 11,
        position: 11,
        rating: 1422, // EXPECTED -79
      },
    ]),
  );
  */

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
      ratingChange: ratingDelta,
    });
  }

  return iRatingChanges;
}
