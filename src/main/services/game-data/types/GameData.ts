import { GameName } from "./GameName";

export interface RealtimeGameData {
  throttle?: number; // Float: [0, 1]
  brake?: number; // Float: [0, 1]
  steeringAnglePct?: number; // Float: [0, 1]
  gear?: number; // Int: [0, 1]
  speedKph?: number; // Float (-Infinity, +Infinity)
  speedMph?: number; // Float (-Infinity, +Infinity)
  rpm?: number; // Float [0, +Infinity]
  rpmStageFirst?: number; // Int: [0, +Infinity)
  rpmStageShift?: number; // Int: [0, +Infinity)
  rpmStageLast?: number; // Int: [0, +Infinity)
  rpmStageBlink?: number; // Int: [0, +Infinity)
  displayUnits?: "IMPERIAL" | "METRIC"; // String: "IMPERIAL" | "METRIC"
  absActive?: boolean;
  isOnTrack?: boolean;
  isInReplay?: boolean;
  spectateCarId?: number;
  test?: number | string | boolean | number[] | boolean[] | string[];
}

export interface DriverElement {
  carId?: number;
  position?: number;
  classPosition?: number;
  iRacingClass?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  teamId?: number | null;
  teamName?: string | null;
  iRating?: number;
  lapDistPct?: number;
  lapDistTotalPct?: number;
  lapsCompleted?: number;
  rpm?: number;
  gear?: number;
  isCarOnTrack?: boolean;
}

export interface Session {
  trackName?: string;
}

export interface MappedGameData {
  game: GameName;
  isConnected: boolean;
  realtime: RealtimeGameData;
  drivers: DriverElement[];
  session: Session;
}
