import { SessionInfoData, TelemetryValues } from 'iracing-sdk-2025/src/JsIrSdk';

import { calculateIRatingChanges } from '../calculations/calculateIRatingChanges';
import { getCarSpeedKph } from '../helpers/getCarSpeedKph';
import { getIsCarInWorld } from '../helpers/getIsCarInWorld';
import { getIsCarOffTrack } from '../helpers/getIsCarOffTrack';
import { getIsCarOnTrack } from '../helpers/getIsCarOnTrack';
import { getLapDistTotalPct } from '../helpers/getLapDistTotalPct';
import { getTrackLengthInMeters } from '../helpers/getTrackLengthMeters';
import { parseDriverName } from '../helpers/parseDriverName';

import { iRacingDriverData } from '@/main/shared/types/iRacing';

export function getDriversFields(
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): iRacingDriverData[] {
  const drivers: iRacingDriverData[] = [];
  // live position is calculated wrong when driver is out of vision
  // const livePosition = calculateDriversLivePositions(telemetry, sessionInfo);
  telemetry.CarIdxTrackSurface[telemetry.CamCarIdx] !== 'NotInWorld';

  for (const driver of sessionInfo.DriverInfo.Drivers) {
    if (driver.CarIsPaceCar || driver.IsSpectator) continue;
    // Compute class-relative iRating changes
    const classGroups: Record<number, { id: number; position: number; rating: number }[]> = {};

    for (const other of sessionInfo.DriverInfo.Drivers) {
      if (other.CarIsPaceCar || other.IsSpectator) continue;

      const id = other.CarIdx;
      // live position is calculated wrong when driver is out of vision
      // const position = livePosition.get(id)?.classPosition || 0;
      const position = telemetry.CarIdxClassPosition[driver.CarIdx];
      const rating = other.IRating;
      const cid = other.CarClassID;

      if (!classGroups[cid]) classGroups[cid] = [];
      classGroups[cid].push({ id, position, rating });
    }

    const classArray = classGroups[driver.CarClassID] || [];
    const ratingChanges = calculateIRatingChanges(classArray);
    const iRatingChangeEntry = ratingChanges.find(e => e.id === driver.CarIdx);

    drivers.push({
      carId: driver.CarIdx,
      carNumber: driver.CarNumberRaw,
      firstName: parseDriverName(driver.UserName).firstName,
      lastName: parseDriverName(driver.UserName).lastName,
      middleName: parseDriverName(driver.UserName).middleName,
      lapDistPct: telemetry.CarIdxLapDistPct[driver.CarIdx], // -1 when driver is not on track or not in vision
      lapDistTotalPct: getLapDistTotalPct(telemetry, driver.CarIdx) || 0,
      lapsCompleted:
        telemetry.CarIdxLapCompleted[driver.CarIdx] >= 0
          ? telemetry.CarIdxLapCompleted[driver.CarIdx]
          : 0,
      currentLap: telemetry.CarIdxLap[driver.CarIdx] > 0 ? telemetry.CarIdxLap[driver.CarIdx] : 0,
      // position: livePosition.get(driver.CarIdx)?.position || 0, (AS SOME DRIVERS ARE OUT OF VISION IT COULD BE CALCULATED WRONG)
      position: telemetry.CarIdxPosition[driver.CarIdx],
      // classPosition: livePosition.get(driver.CarIdx)?.classPosition || 0, (AS SOME DRIVERS ARE OUT OF VISION IT COULD BE CALCULATED WRONG)
      classPosition: telemetry.CarIdxClassPosition[driver.CarIdx],
      isCarInWorld: getIsCarInWorld(telemetry, driver.CarIdx),
      isCarOnTrack: getIsCarOnTrack(telemetry, driver.CarIdx),
      isCarOffTrack: getIsCarOffTrack(telemetry, driver.CarIdx),
      iRating: driver.IRating,
      iRatingChange: iRatingChangeEntry ? iRatingChangeEntry.ratingChange : 0,
      /*
       * driver.CarClassShortName might be null (probably in replays)
       * so it would be a good option to save car class short names in cache and relate them to driver.CarID
       */
      carClassShortName: driver.CarClassShortName,
      carClassId: driver.CarClassID,
      iRacingLicString: driver.LicString[0] || '',
      iRacingLicSubLevel: driver.LicSubLevel / 100,
      // deltaToSelectedDriver: relativeTime,
      speedKph: getCarSpeedKph(
        driver.CarIdx,
        telemetry.CarIdxLapDistPct[driver.CarIdx],
        getTrackLengthInMeters(sessionInfo.WeekendInfo.TrackLength),
        telemetry.SessionTime,
      ),

      // test: telemetry.CarIdxTrackSurface[driver.CarIdx],
    });
  }

  return drivers;
}
