import { EventEmitter } from "events";
import { MappedGameData } from "../types/GameData";
import { GameName } from "../types/GameName";

export interface RaceStatus {
  isOnTrack: boolean;
  isInReplay: boolean;
  isConnected: boolean;
}

interface GameDataEvents {
  game: GameName | null;
  data: MappedGameData;
  status: RaceStatus;
}

export default class GameDataEmitter extends EventEmitter {
  constructor() {
    super();
    this.addListener("data", (data) => {
      if (!data.isConnected) {
        this.status = {
          isOnTrack: false,
          isInReplay: false,
          isConnected: data.isConnected,
        };
      } else {
        this.status = {
          isOnTrack: data.realtime.isOnTrack || false,
          isInReplay: data.realtime.isInReplay || false,
          isConnected: data.isConnected,
        };
      }
    });
  }

  private _status: RaceStatus = {
    isInReplay: false,
    isOnTrack: false,
    isConnected: false,
  };

  private set status(status: RaceStatus) {
    if (
      status.isInReplay === this.status.isInReplay &&
      status.isOnTrack === this.status.isOnTrack
    )
      return;

    this._status = status;
    this.emit("status", status);
  }

  public get status() {
    return this._status;
  }

  override on<K extends keyof GameDataEvents>(
    event: K,
    listener: (arg: GameDataEvents[K]) => void,
  ): this {
    return super.on(event, listener);
  }

  override addListener<K extends keyof GameDataEvents>(
    event: K,
    listener: (arg: GameDataEvents[K]) => void,
  ): this {
    return super.addListener(event, listener);
  }

  override emit<K extends keyof GameDataEvents>(
    event: K,
    arg: GameDataEvents[K],
  ): boolean {
    return super.emit(event, arg);
  }
}
