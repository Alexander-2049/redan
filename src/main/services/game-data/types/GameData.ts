import { z } from "zod";
import { GameNameSchema } from "./GameName";

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
  test: z
    .union([
      z.number(),
      z.string(),
      z.boolean(),
      z.array(z.number()),
      z.array(z.boolean()),
      z.array(z.string()),
    ])
    .optional(),
});
export type RealtimeGameData = z.infer<typeof RealtimeGameDataSchema>;

// DriverElement
export const DriverElementSchema = z.object({
  carId: z.number().optional(),
  position: z.number().optional(),
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
  rpm: z.number().nullable().optional(),
  gear: z.number().nullable().optional(),
  isCarOnTrack: z.boolean().optional(),
  carClassShortName: z.union([z.string(), z.null()]).optional(),
  carClassId: z.number().optional(),
  iRacingLicString: z.union([z.string(), z.null()]).optional(),
  iRacingLicSubLevel: z.number().optional(),
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
