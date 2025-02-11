import { telemetryMessageSchema } from "../schemas/iracingMessageSchema";
import { sessionInfoSchema } from "../schemas/sessionInfoSchema";
import { z } from "zod";

export type iRacingMessage =
  | TelemetryMessage
  | SessionInfoMessage
  | ConnectedMessage;

export interface TelemetryMessage {
  type: "Telemetry";
  data: z.infer<typeof telemetryMessageSchema> | null;
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
