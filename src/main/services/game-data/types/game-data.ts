import { z } from "zod";
import { GameNameSchema } from "./game-name";

export const RealtimeLapTimeSchema = z.object({
  lapBestLap: z.number().nullable().optional(),
  lapBestLapTime: z.number().nullable().optional(),
  lapLastLapTime: z.number().nullable().optional(),
  lapCurrentLapTime: z.number().nullable().optional(),
  lapLasNLapSeq: z.number().nullable().optional(),
  lapLastNLapTime: z.number().nullable().optional(),
  lapBestNLapLap: z.number().nullable().optional(),
  lapBestNLapTime: z.number().nullable().optional(),
  lapDeltaToBestLap: z.number().nullable().optional(),
  lapDeltaToBestLap_DD: z.number().nullable().optional(),
  lapDeltaToBestLap_OK: z.boolean().nullable().optional(),
  lapDeltaToOptimalLap: z.number().nullable().optional(),
  lapDeltaToOptimalLap_DD: z.number().nullable().optional(),
  lapDeltaToOptimalLap_OK: z.boolean().nullable().optional(),
  lapDeltaToSessionBestLap: z.number().nullable().optional(),
  lapDeltaToSessionBestLap_DD: z.number().nullable().optional(),
  lapDeltaToSessionBestLap_OK: z.boolean().nullable().optional(),
  lapDeltaToSessionOptimalLap: z.number().nullable().optional(),
  lapDeltaToSessionOptimalLap_DD: z.number().nullable().optional(),
  lapDeltaToSessionOptimalLap_OK: z.boolean().nullable().optional(),
  lapDeltaToSessionLastlLap: z.number().nullable().optional(),
  lapDeltaToSessionLastlLap_DD: z.number().nullable().optional(),
  lapDeltaToSessionLastlLap_OK: z.boolean().nullable().optional(),
});
export type RealtimeLapTime = z.infer<typeof RealtimeLapTimeSchema>;

// RealtimeGameData
export const RealtimeGameDataSchema = z.object({
  throttle: z.number().min(0).max(1).optional(),
  brake: z.number().min(0).max(1).optional(),
  steeringAnglePct: z.number().min(-1).max(1).optional(),
  gear: z.number().int().min(-1).max(30).optional(),
  speedKph: z.number().optional(),
  speedMph: z.number().optional(),
  rpm: z.number().min(0).optional(),
  rpmStageFirst: z.number().int().min(0).optional(),
  rpmStageShift: z.number().int().min(0).optional(),
  rpmStageLast: z.number().int().min(0).optional(),
  rpmStageBlink: z.number().int().min(0).optional(),
  displayUnits: z.enum(["IMPERIAL", "METRIC"]).optional(),
  absActive: z.boolean().optional(),
  isOnTrack: z.boolean().optional(),
  isInReplay: z.boolean().optional(),
  spectateCarId: z.number().optional(),
  lapTimes: RealtimeLapTimeSchema.optional(),
});
export type RealtimeGameData = z.infer<typeof RealtimeGameDataSchema>;

// DriverElement
export const DriverElementSchema = z.object({
  carId: z.number().optional(),
  carNumber: z.number().optional(),
  position: z.number().nullable().optional(),
  classPosition: z.number().optional(),
  iRacingClass: z.number().optional(),
  firstName: z.string().optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
  teamId: z.union([z.number(), z.null()]).optional(),
  teamName: z.union([z.string(), z.null()]).optional(),
  iRating: z.number().nullable().optional(),
  iRatingChange: z.number().nullable().optional(),
  lapDistPct: z.number().nullable().optional(),
  lapDistTotalPct: z.number().nullable().optional(),
  lapsCompleted: z.number().nullable().optional(),
  currentLap: z.number().nullable().optional(),
  rpm: z.number().nullable().optional(),
  gear: z.number().nullable().optional(),
  isCarOnTrack: z.boolean().optional(),
  carClassShortName: z.union([z.string(), z.null()]).optional(),
  carClassId: z.number().optional(),
  iRacingLicString: z.union([z.string(), z.null()]).optional(),
  iRacingLicSubLevel: z.number().optional(),
  // Time delta to the selected driver using the shortest path forward along the track.
  // Positive means we are behind; negative means we are ahead (if ever applicable).
  deltaToSelectedDriverForward: z.number().nullable().optional(),

  // Time delta to the selected driver using the longer path in reverse (the other way around the track).
  // Effectively represents how much we are ahead of the selected driver if measured in the reverse direction.
  deltaToSelectedDriverReverse: z.number().nullable().optional(),
});
export type DriverElement = z.infer<typeof DriverElementSchema>;

export const WetnessSchema = z.enum([
  "",
  "Dry",
  "Mostly Dry",
  "Very Lightly Wet",
  "Lightly Wet",
  "Moderately Wet",
  "Very Wet",
  "Extremely Wet",
]);
export type Wetness = z.infer<typeof WetnessSchema>;

export const SessionSchema = z.object({
  trackName: z.string().optional(),
  wetnessString: WetnessSchema.optional(),
  wetnessLevel: z.number().optional(),
  trackTempC: z.number().nullable().optional(),
  trackTempCString: z.string().nullable().optional(),
  airTempC: z.number().nullable().optional(),
  airTempCString: z.string().nullable().optional(),
  trackTempF: z.number().nullable().optional(),
  trackTempFString: z.string().nullable().optional(),
  airTempF: z.number().nullable().optional(),
  airTempFString: z.string().nullable().optional(),
});
export type Session = z.infer<typeof SessionSchema>;

export const MappedGameDataSchema = z.object({
  game: GameNameSchema,
  realtime: RealtimeGameDataSchema,
  drivers: z.array(DriverElementSchema),
  session: SessionSchema,
});

export type MappedGameData = z.infer<typeof MappedGameDataSchema>;
