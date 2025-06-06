import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { DriverElement } from "../../../types/GameData";
import {
  calculateDriversLivePositions,
  calculateIRatingChanges,
  getCarIsOnTrack,
  getLapDistTotalPct,
  parseDriverName,
} from "../utils";

export default function getDriversFields(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): DriverElement[] {
  const drivers: DriverElement[] = [];
  const livePosition = calculateDriversLivePositions(telemetry, sessionInfo);
  telemetry.CarIdxTrackSurface[telemetry.CamCarIdx] !== "NotInWorld";

  for (const driver of sessionInfo.DriverInfo.Drivers) {
    if (driver.CarIsPaceCar || driver.IsSpectator) continue;
    // Compute class-relative iRating changes
    const classGroups: Record<
      number,
      { id: number; position: number; rating: number }[]
    > = {};

    for (const other of sessionInfo.DriverInfo.Drivers) {
      if (other.CarIsPaceCar || other.IsSpectator) continue;

      const id = other.CarIdx;
      const position = livePosition.get(id)?.classPosition || 0;
      const rating = other.IRating;
      const cid = other.CarClassID;

      if (!classGroups[cid]) classGroups[cid] = [];
      classGroups[cid].push({ id, position, rating });
    }

    const classArray = classGroups[driver.CarClassID] || [];
    const ratingChanges = calculateIRatingChanges(classArray);
    const iRatingChangeEntry = ratingChanges.find(
      (e) => e.id === driver.CarIdx,
    );

    drivers.push({
      carId: driver.CarIdx,
      carNumber: driver.CarNumberRaw,
      firstName: parseDriverName(driver.UserName).firstName,
      lastName: parseDriverName(driver.UserName).lastName,
      middleName: parseDriverName(driver.UserName).middleName,
      lapDistPct:
        telemetry.CarIdxLapDistPct[driver.CarIdx] > 0
          ? telemetry.CarIdxLapDistPct[driver.CarIdx]
          : null,
      lapDistTotalPct: getLapDistTotalPct(telemetry, driver.CarIdx),
      lapsCompleted:
        telemetry.CarIdxLapCompleted[driver.CarIdx] >= 0
          ? telemetry.CarIdxLapCompleted[driver.CarIdx]
          : null,
      currentLap:
        telemetry.CarIdxLap[driver.CarIdx] > 0
          ? telemetry.CarIdxLap[driver.CarIdx]
          : null,
      position: livePosition.get(driver.CarIdx)?.position || null,
      classPosition: livePosition.get(driver.CarIdx)?.classPosition || 0,
      isCarOnTrack: getCarIsOnTrack(telemetry, driver.CarIdx),
      iRating: driver.IRating,
      iRatingChange: iRatingChangeEntry ? iRatingChangeEntry.ratingChange : 0,

      /*
       * driver.CarClassShortName might be null (probably in replays)
       * so it would be a good option to save car class short names in cache and relate them to driver.CarID
       */
      carClassShortName: driver.CarClassShortName,
      carClassId: driver.CarClassID,
      iRacingLicString: driver.LicString[0] || null,
      iRacingLicSubLevel: driver.LicSubLevel / 100,
      // deltaToSelectedDriver: relativeTime,
    });
  }

  return drivers;
}
