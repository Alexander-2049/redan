import { z } from 'zod';

import { gameNameSchema } from '../game-name-schema';
import { wetnessSchema } from '../wetness';

export const minimalRealtime = z.object({
  throttle: z.number(),
  brake: z.number(),
  steeringAnglePct: z.number(),
  gear: z.number(),
  speedKph: z.number(),
  speedMph: z.number(),
  rpm: z.number(),
  rpmStageFirst: z.number(),
  rpmStageShift: z.number(),
  rpmStageLast: z.number(),
  rpmStageBlink: z.number(),
  displayUnits: z.enum(['IMPERIAL', 'METRIC']),
  absActive: z.boolean(),
  isOnTrack: z.boolean(),
  isInReplay: z.boolean(),
  spectateCarId: z.number(),
  lapTimes: z
    .object({
      lapBestLap: z.number(),
      lapBestLapTime: z.number(),
      lapLastLapTime: z.number(),
      lapCurrentLapTime: z.number(),
      lapLasNLapSeq: z.number(),
      lapLastNLapTime: z.number(),
      lapBestNLapLap: z.number(),
      lapBestNLapTime: z.number(),
      lapDeltaToBestLap: z.number(),
      lapDeltaToBestLap_DD: z.number(),
      lapDeltaToBestLap_OK: z.boolean(),
      lapDeltaToOptimalLap: z.number(),
      lapDeltaToOptimalLap_DD: z.number(),
      lapDeltaToOptimalLap_OK: z.boolean(),
      lapDeltaToSessionBestLap: z.number(),
      lapDeltaToSessionBestLap_DD: z.number(),
      lapDeltaToSessionBestLap_OK: z.boolean(),
      lapDeltaToSessionOptimalLap: z.number(),
      lapDeltaToSessionOptimalLap_DD: z.number(),
      lapDeltaToSessionOptimalLap_OK: z.boolean(),
      lapDeltaToSessionLastlLap: z.number(),
      lapDeltaToSessionLastlLap_DD: z.number(),
      lapDeltaToSessionLastlLap_OK: z.boolean(),
    })
    .strict(),
});
export const minimalSession = z.object({
  trackName: z.string(),
  wetnessString: wetnessSchema,
  wetnessLevel: z.number(),
  trackTempC: z.number(),
  trackTempF: z.number(),
  airTempC: z.number(),
  airTempF: z.number(),
  trackTempCString: z.string(),
  trackTempFString: z.string(),
  airTempCString: z.string(),
  airTempFString: z.string(),
  trackLengthMeters: z.number(),
  currentSessionType: z.string(),
});
export const minimalDriver = z.object({
  carId: z.number(),
  carNumber: z.number(),
  firstName: z.string(),
  lastName: z.string(),
  middleName: z.string(),
  lapDistPct: z.number(),
  lapDistTotalPct: z.number(),
  lapsCompleted: z.number(),
  currentLap: z.number(),
  position: z.number(),
  classPosition: z.number(),
  isCarInWorld: z.boolean(),
  isCarOnTrack: z.boolean(),
  iRating: z.number(),
  iRatingChange: z.number(),
  carClassShortName: z.string(),
  carClassId: z.number(),
  iRacingLicString: z.string(),
  iRacingLicSubLevel: z.number(),
});

const iRacingShape = {
  game: z.literal(gameNameSchema.Values.iRacing),
  realtime: minimalRealtime,
  drivers: z.array(minimalDriver),
  session: minimalSession,
};

export const iRacingDataSchema = z.object(iRacingShape).strict();
