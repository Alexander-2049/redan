import GameDataEmitter from "./game-data-emitter";

abstract class Game extends GameDataEmitter {
  protected _isListening = false;

  get isListening() {
    return this._isListening;
  }

  abstract connect(updateInterval: number): void;
  abstract disconnect(): void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}

export default Game;
