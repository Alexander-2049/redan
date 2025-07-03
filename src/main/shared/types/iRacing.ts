import { z } from 'zod';

import {
  iRacingDataSchema,
  minimalDriver,
  minimalRealtime,
  minimalSession,
} from '../schemas/game-data/iracing-schema';

export type iRacingData = z.infer<typeof iRacingDataSchema>;
export type iRacingRealtimeData = z.infer<typeof minimalRealtime>;
export type iRacingSessionData = z.infer<typeof minimalSession>;
export type iRacingDriverData = z.infer<typeof minimalDriver>;
