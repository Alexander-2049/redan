import { TelemetryInterface } from "../../shared/types/telemetry";
import { SessionInfo } from "../../shared/types/sessionInfo";
import { ConnectedListeners } from "../models/ConnectedListeners";

export type SelectedGame = "NONE" | "IRACING" | "ACC";

export type ObjectOptions =
  | DataRPM
  | DataSpeed
  | DataControls
  | DataState
  | SessionInfo
  | TelemetryInterface;

export interface WebSocketConnections {
  controls: ConnectedListeners<DataControls>;
  rpm: ConnectedListeners<DataRPM>;
  speed: ConnectedListeners<DataSpeed>;
  state: ConnectedListeners<DataState>;
  sessionInfo: ConnectedListeners<SessionInfo>;
  telemetry: ConnectedListeners<TelemetryInterface>;
}

export type DisplayUnits = "METRIC" | "IMPERIAL";

export interface DataRPM {
  rpm: number;
  green: number;
  orange: number;
  red: number;
  max: number;
}

export interface DataSpeed {
  speedKph: number;
  speedMph: number;
  displayUnits: DisplayUnits;
}

export interface DataControls {
  throttle: number;
  brake: number;
  clutch: number;
  steeringAnglePercents: number;
  gear: number;
}

export interface DataState {
  isOnPitLane: boolean;
  isOnTrack: boolean;
  isInGarage: boolean;
}
