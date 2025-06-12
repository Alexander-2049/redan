import { sessionInfoSchema } from "../schemas/sessionInfoSchema";
import { z } from "zod";
import { telemetrySchema } from "../schemas/telemetrySchema";

export type iRacingMessage =
  | TelemetryMessage
  | SessionInfoMessage
  | ConnectedMessage;

export interface TelemetryMessage {
  type: "Telemetry";
  data: z.infer<typeof telemetrySchema> | null;
  timestamp: string;
}

export interface SessionInfoMessage {
  type: "SessionInfo";
  data: z.infer<typeof sessionInfoSchema> | null;
  timestamp: string;
}

export interface ConnectedMessage {
  type: "Connected";
  data: boolean;
  timestamp: string;
}
