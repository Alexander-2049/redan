import { IAssettoCorsaData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaData";

export type Game = "Assetto Corsa" | "Assetto Corsa Competizione" | "iRacing";

export interface IRealtimeGameData {
  throttle?: number;
  brake?: number;
  steeringAngle?: number;
}

export interface IMappedGameData {
  game: Game;
  connected: boolean;
  realtime: IRealtimeGameData;
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
  };
}
