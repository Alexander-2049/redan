import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { DriverElement } from "../../types/GameData";

export function parseDriverName(fullName: string) {
  const parts = fullName.split(" ");
  const firstName = parts[0] || "";
  const lastName = parts[parts.length - 1] || "";
  const middleName = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";

  return { firstName, middleName, lastName };
}

export function mapDriverData(
  i: number,
  driver: SessionInfoData["DriverInfo"]["Drivers"][number],
  telemetry: TelemetryValues,
  positionMap: Map<number, number>,
  classPositionMap: Map<number, number>,
): DriverElement | null {
  if (driver.CarIsPaceCar) return null;

  const { firstName, middleName, lastName } = parseDriverName(driver.UserName);

  return {
    position: positionMap.get(i) ?? 0,
    classPosition: classPositionMap.get(i) ?? 0,
    iRacingClass: telemetry.CarIdxClass[i],
    firstName,
    middleName,
    lastName,
    teamId: driver.TeamID === 0 ? null : driver.TeamID,
    teamName: driver.TeamID === 0 ? null : driver.TeamName,
    iRating: driver.IRating,
    lapDistPct: telemetry.CarIdxLapDistPct[i],
    lapDistTotalPct:
      telemetry.CarIdxLapCompleted[i] + telemetry.CarIdxLapDistPct[i],
    lapsCompleted: telemetry.CarIdxLapCompleted[i],
    gear: telemetry.CarIdxGear[i],
  };
}

export type DistanceEntry = {
  index: number;
  totalDist: number;
  classId: number;
};

export function calculateDistancesAndSort(
  telemetry: TelemetryValues,
  drivers: SessionInfoData["DriverInfo"]["Drivers"],
) {
  const distanceArray: DistanceEntry[] = [];

  for (let i = 0; i < drivers.length; i++) {
    const totalDist =
      telemetry.CarIdxLapCompleted[i] + telemetry.CarIdxLapDistPct[i];
    const classId = telemetry.CarIdxClass[i];
    distanceArray.push({ index: i, totalDist, classId });
  }

  distanceArray.sort((a, b) => b.totalDist - a.totalDist);

  const positionMap = new Map<number, number>();
  distanceArray.forEach((entry, idx) => positionMap.set(entry.index, idx + 1));

  const classPositionMap = new Map<number, number>();
  const classGrouped: Record<number, DistanceEntry[]> = {};

  for (const entry of distanceArray) {
    if (!classGrouped[entry.classId]) classGrouped[entry.classId] = [];
    classGrouped[entry.classId].push(entry);
  }

  for (const classId in classGrouped) {
    const sorted = classGrouped[classId].sort(
      (a, b) => b.totalDist - a.totalDist,
    );
    sorted.forEach((entry, idx) => classPositionMap.set(entry.index, idx + 1));
  }

  return { positionMap, classPositionMap };
}
