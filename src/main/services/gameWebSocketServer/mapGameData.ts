import { RealtimeCarAndEntryDataUpdate } from "ac-sdk-2025";
import { IAssettoCorsaCompetizioneData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaCompetizioneData";
import { IAssettoCorsaData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaData";
import { SessionInfoData, TelemetryValues } from "iracing-sdk-2025/src/JsIrSdk";

export type Game =
  | "none"
  | "Assetto Corsa"
  | "Assetto Corsa Competizione"
  | "iRacing";

export interface IRealtimeGameData {
  throttle?: number;
  brake?: number;
  steeringAngle?: number;
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
      steeringAngle: e.steeringAngle,
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
      steeringAngle: acc_shared_memory_update.steeringAngle,
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

    if (username.length === 2) {
      firstName = username[0];
      lastName = username[1];
    }
    if (username.length === 3) {
      firstName = username[0];
      middleName = username[1];
      lastName = username[2];
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
      steeringAngle: telemetry.SteeringWheelAngle,
    },
    entrylist,
  };
}
