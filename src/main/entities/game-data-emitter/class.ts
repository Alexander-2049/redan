import { EventEmitter } from 'events';

import { GameData } from '../game';

import { GameName } from '@/main/shared/types/GameName';

interface GameDataEvents {
  game: GameName | null;
  data: GameData;
  isInReplay: boolean;
  isOnTrack: boolean;
  isConnected: boolean;
}

export class GameDataEmitter extends EventEmitter {
  private _isConnected = false;
  private _isInReplay = false;
  private _isOnTrack = false;

  constructor() {
    super();
    this.on('data', (data: GameData) => {
      this.isInReplay = data.realtime.isInReplay || false;
      this.isOnTrack = data.realtime.isOnTrack || false;
    });
  }

  get isConnected() {
    return this._isConnected;
  }
  set isConnected(value: boolean) {
    if (this._isConnected !== value) {
      this._isConnected = value;
      this.emit('isConnected', value);
    }
  }

  get isInReplay() {
    return this._isInReplay;
  }
  set isInReplay(value: boolean) {
    if (this._isInReplay !== value) {
      this._isInReplay = value;
      this.emit('isInReplay', value);
    }
  }

  get isOnTrack() {
    return this._isOnTrack;
  }
  set isOnTrack(value: boolean) {
    if (this._isOnTrack !== value) {
      this._isOnTrack = value;
      this.emit('isOnTrack', value);
    }
  }

  override addListener<K extends keyof GameDataEvents>(
    event: K,
    listener: (arg: GameDataEvents[K]) => void,
  ): this {
    return super.on(event, listener);
  }
  override on<K extends keyof GameDataEvents>(
    event: K,
    listener: (arg: GameDataEvents[K]) => void,
  ): this {
    return super.on(event, listener);
  }

  override emit<K extends keyof GameDataEvents>(event: K, arg: GameDataEvents[K]): boolean {
    return super.emit(event, arg);
  }
}
