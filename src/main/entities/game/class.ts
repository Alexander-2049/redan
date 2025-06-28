import { GameDataEmitter } from '../game-data-emitter';

import { GameData } from './model';

export abstract class Game extends GameDataEmitter {
  protected _isListening = false;

  get isListening() {
    return this._isListening;
  }

  abstract connect(updateInterval: number): void;
  abstract disconnect(): void;
  abstract getMock(tick: number): GameData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}
