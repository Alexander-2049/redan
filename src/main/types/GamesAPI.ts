import { ConnectedListeners } from "../models/ConnectedListeners";

export type SelectedGame = "NONE" | "IRACING" | "ACC";

export type ObjectOptions =
  | DataRPM
  | DataSpeed
  | DataControls
  | DataCarLocation
  | DataGear;

export interface WebSocketConnections {
  controls: ConnectedListeners<DataControls>;
  rpm: ConnectedListeners<DataRPM>;
  speed: ConnectedListeners<DataSpeed>;
  carLocation: ConnectedListeners<DataCarLocation>;
  gear: ConnectedListeners<DataGear>;
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
}

export interface DataCarLocation {
  isOnPitLane: boolean;
  isOnTrack: boolean;
  isInGarage: boolean;
}

export interface DataGear {
  gear: number;
}
