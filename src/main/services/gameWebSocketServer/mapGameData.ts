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

export function mapDataFromAssettoCorsaCompetizione(
  c: boolean,
  e: IAssettoCorsaCompetizioneData,
): IMappedGameData {
  return {
    connected: c,
    game: "Assetto Corsa Competizione",
    realtime: {
      throttle: e.throttle,
      brake: e.brake,
      steeringAngle: e.steeringAngle,
    },
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
  };
}
