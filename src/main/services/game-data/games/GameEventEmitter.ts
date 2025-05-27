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
  enteredReplay: boolean;
  exitedReplay: boolean;
  enteredTrack: boolean;
  exitedTrack: boolean;
  connected: boolean;
  disconnected: boolean;
}

export default class GameDataEmitter extends EventEmitter {
  constructor() {
    super();
    this.addListener("data", (data) => {
      if (!data.isConnected) {
        this.isInReplay = false;
        this.isOnTrack = false;
        this.isConnected = data.isConnected;
      } else {
        this.isOnTrack = data.realtime.isOnTrack || false;
        this.isInReplay = data.realtime.isInReplay || false;
        this.isConnected = data.isConnected;
      }
    });
  }

  private _isInReplay = false;
  private _isOnTrack = false;
  private _isConnected = false;

  protected set isInReplay(isInReplay: boolean) {
    if (this._isInReplay === isInReplay) return;
    this._isInReplay = isInReplay;
    if (isInReplay) this.emit("enteredReplay", true);
    else this.emit("exitedReplay", true);
  }

  public get isInReplay() {
    return this._isInReplay;
  }

  protected set isOnTrack(isOnTrack: boolean) {
    if (this._isOnTrack === isOnTrack) return;
    this._isOnTrack = isOnTrack;
    if (isOnTrack) this.emit("enteredTrack", true);
    else this.emit("exitedTrack", true);
  }

  public get isOnTrack() {
    return this._isOnTrack;
  }

  protected set isConnected(isConnected: boolean) {
    if (this._isConnected === isConnected) return;
    this._isConnected = isConnected;
    if (isConnected) this.emit("connected", true);
    else this.emit("disconnected", true);
  }

  public get isConnected() {
    return this._isConnected;
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
