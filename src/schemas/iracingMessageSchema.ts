import { z } from "zod";

export const telemetryMessageSchema = z.object({
  type: z.literal("Telemetry"),
  timestamp: z.string(),
});

export const sessionInfoMessageSchema = z.object({
  type: z.literal("SessionInfo"),
  timestamp: z.string(),
});

export const connectedMessageSchema = z.object({
  type: z.literal("Connected"),
  data: z.boolean(),
  timestamp: z.string(),
});
