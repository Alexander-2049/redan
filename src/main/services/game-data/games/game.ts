import { MappedGameData } from "../types/game-data-schema";
import GameDataEmitter from "./game-data-emitter";

abstract class Game extends GameDataEmitter {
  protected _isListening = false;

  get isListening() {
    return this._isListening;
  }

  abstract connect(updateInterval: number): void;
  abstract disconnect(): void;
  abstract getMock(tick: number): MappedGameData;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

export default Game;
