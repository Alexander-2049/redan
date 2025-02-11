import { ConnectedListeners } from "../models/ConnectedListeners";
import { sessionInfoSchema } from "../../schemas/sessionInfoSchema";
import { telemetrySchema } from "../../schemas/telemetrySchema";
import { z } from "zod";

export const displayUnitsSchema = z.union([
  z.literal("METRIC"),
  z.literal("IMPERIAL"),
]);

export const dataRPMSchema = z.object({
  rpm: z.number(),
  green: z.number(),
  orange: z.number(),
  red: z.number(),
  max: z.number(),
});

export const dataSpeedSchema = z.object({
  speedKph: z.number(),
  speedMph: z.number(),
  displayUnits: displayUnitsSchema,
});

export const dataControlsSchema = z.object({
  throttle: z.number(),
  brake: z.number(),
  clutch: z.number(),
  steeringAnglePercents: z.number(),
  gear: z.number(),
});

export const dataStateSchema = z.object({
  isOnPitLane: z.boolean(),
  isOnTrack: z.boolean(),
  isInGarage: z.boolean(),
});

export const dataConnectedSchema = z.object({
  isConnected: z.boolean(),
});

export const selectedGameSchema = z.union([
  z.literal("NONE"),
  z.literal("IRACING"),
  z.literal("ACC"),
]);

export type ObjectOptions =
  | z.infer<typeof dataRPMSchema>
  | z.infer<typeof dataSpeedSchema>
  | z.infer<typeof dataControlsSchema>
  | z.infer<typeof dataStateSchema>
  | z.infer<typeof sessionInfoSchema>
  | z.infer<typeof telemetrySchema>
  | z.infer<typeof dataConnectedSchema>;

export interface WebSocketConnections {
  controls: ConnectedListeners<z.infer<typeof dataControlsSchema>>;
  rpm: ConnectedListeners<z.infer<typeof dataRPMSchema>>;
  speed: ConnectedListeners<z.infer<typeof dataSpeedSchema>>;
  state: ConnectedListeners<z.infer<typeof dataStateSchema>>;
  sessionInfo: ConnectedListeners<z.infer<typeof sessionInfoSchema>>;
  telemetry: ConnectedListeners<z.infer<typeof telemetrySchema>>;
  connected: ConnectedListeners<z.infer<typeof dataConnectedSchema>>;
}
