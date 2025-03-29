import { RealtimeCarAndEntryDataUpdate } from "ac-sdk-2025";
import { IAssettoCorsaCompetizioneData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaCompetizioneData";
import { IAssettoCorsaData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaData";
// import { sessionInfoSchema } from "src/shared/schemas/sessionInfoSchema";
import { telemetrySchema } from "src/shared/schemas/telemetrySchema";
import { z } from "zod";

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
  telemetry: z.infer<typeof telemetrySchema>,
  // sessionInfo: z.infer<typeof sessionInfoSchema>,
): IMappedGameData {
  return {
    connected: c,
    game: "Assetto Corsa Competizione",
    realtime: {
      throttle: telemetry.Throttle,
      brake: telemetry.Brake,
      steeringAngle: telemetry.SteeringWheelAngle,
    },
    entrylist: [],
  };
}
