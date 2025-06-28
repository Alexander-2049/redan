import { z } from 'zod';

import { sessionInfoSchema } from './sessionInfoSchema';
import { telemetrySchema } from './telemetrySchema';

export const telemetryMessageSchema = z.object({
  type: z.literal('Telemetry'),
  data: telemetrySchema,
  timestamp: z.string(),
});

export const sessionInfoMessageSchema = z.object({
  type: z.literal('SessionInfo'),
  data: sessionInfoSchema,
  timestamp: z.string(),
});

export const connectedMessageSchema = z.object({
  type: z.literal('Connected'),
  data: z.boolean(),
  timestamp: z.string(),
});
