import { RealtimeCarAndEntryDataUpdate } from "ac-sdk-2025";
import { IAssettoCorsaCompetizioneData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaCompetizioneData";
import { IAssettoCorsaData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaData";
import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";
import { iracingSteeringAngleToPercents } from "./utils/iracingSteeringAngleToPercents";
import { SpeedConverter } from "@/main/utils/speedConverter";

export type Game =
  | "none"
  | "Assetto Corsa"
  | "Assetto Corsa Competizione"
  | "iRacing";

export interface IRealtimeGameData {
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
  isReplayMode?: boolean;
  test?: number | string | boolean | number[] | boolean[] | string[];
}

export interface IEntryListElement {
  position?: number;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}

export interface IMappedGameData {
  game: Game;
  connected: boolean;
  realtime: IRealtimeGameData;
  entrylist: IEntryListElement[];
}

export function mapDataFromAssettoCorsa(
  c: boolean,
  e: IAssettoCorsaData,
): IMappedGameData {
  return {
    connected: c,
    game: "Assetto Corsa",
    realtime: {
      throttle: e.throttle,
      brake: e.brake,
      rpm: e.rpm,
      gear: e.gear,
      speedKph: e.speedKmh,
      speedMph: SpeedConverter.convert(
        e.speedKmh,
        "KILOMETERS_PER_HOUR",
        "MILES_PER_HOUR",
      ),
      // e.steeringAngle is in range [-1, 1] where -1 is full left and 1 is full right
      // so it need to be converted to percentage somehow
      steeringAnglePct: e.steeringAngle,
      test: e.suspensionTravel,
    },
    entrylist: [],
  };
}

export function mapDataFromAssettoCorsaCompetizione(
  c: boolean,
  acc_shared_memory_update: IAssettoCorsaCompetizioneData,
  acc_udp_cars_update: RealtimeCarAndEntryDataUpdate[] = [],
): IMappedGameData {
  const entrylistElements: IEntryListElement[] = [];
  for (let i = 0; i < acc_udp_cars_update.length; i++) {
    const acc_car = acc_udp_cars_update[i];
    entrylistElements.push({
      position: acc_car.Position,
    });
  }
  entrylistElements.sort((a, b) => (a.position || 0) - (b.position || 0));

  return {
    connected: c,
    game: "Assetto Corsa Competizione",
    realtime: {
      throttle: acc_shared_memory_update.throttle,
      brake: acc_shared_memory_update.brake,
      rpm: acc_shared_memory_update.rpm,
      gear: acc_shared_memory_update.gear,
      speedKph: acc_shared_memory_update.speedKmh,
      speedMph: SpeedConverter.convert(
        acc_shared_memory_update.speedKmh,
        "KILOMETERS_PER_HOUR",
        "MILES_PER_HOUR",
      ),
      // acc_shared_memory_update.steeringAngle is in range [-1, 1] where -1 is full left and 1 is full right
      // so it need to be converted to percentage somehow
      steeringAnglePct: acc_shared_memory_update.steeringAngle,
      test: acc_shared_memory_update.suspensionTravel,
    },
    entrylist: entrylistElements,
  };
}

export function mapDataFromIRacing(
  c: boolean,
  telemetry: TelemetryValues,
  sessionInfo: SessionInfoData,
): IMappedGameData {
  const entrylist: IEntryListElement[] = [];
  for (let i = 0; i < sessionInfo.DriverInfo.Drivers.length; i++) {
    const driver = sessionInfo.DriverInfo.Drivers[i];
    telemetry;

    let username: string[] = [];
    if (typeof driver.UserName === "string")
      username = driver.UserName.split(" ");
    let firstName = "";
    let middleName = "";
    let lastName = "";

    if (username.length > 0) {
      firstName = username[0];
      lastName = username[username.length - 1];
      if (username.length > 2) {
        middleName = username.slice(1, -1).join(" ");
      }
    }

    entrylist.push({
      position: i + 1,
      firstName,
      middleName,
      lastName,
    });
  }

  return {
    connected: c,
    game: "iRacing",
    realtime: {
      throttle: telemetry.Throttle,
      brake: telemetry.Brake,
      steeringAnglePct: iracingSteeringAngleToPercents(
        telemetry.SteeringWheelAngle,
      ),
      gear: telemetry.Gear,
      speedKph: SpeedConverter.convert(
        telemetry.Speed,
        "METERS_PER_SECOND",
        "KILOMETERS_PER_HOUR",
      ),
      speedMph: SpeedConverter.convert(
        telemetry.Speed,
        "METERS_PER_SECOND",
        "MILES_PER_HOUR",
      ),
      rpm: telemetry.RPM,
      rpmStageFirst: telemetry.PlayerCarSLFirstRPM,
      rpmStageShift: telemetry.PlayerCarSLShiftRPM,
      rpmStageLast: telemetry.PlayerCarSLLastRPM,
      rpmStageBlink: telemetry.PlayerCarSLBlinkRPM,
      displayUnits: telemetry.DisplayUnits === 0 ? "IMPERIAL" : "METRIC",
      absActive: telemetry.BrakeABSactive,
      isOnTrack: telemetry.IsOnTrack,
      isReplayMode: telemetry.IsReplayPlaying && !telemetry.IsOnTrackCar,
    },
    entrylist,
  };
}
