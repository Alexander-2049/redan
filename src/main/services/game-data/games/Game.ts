import GameDataEmitter from "./GameDataEmitter";

abstract class Game extends GameDataEmitter {
  protected _isListening = false;

  get isListening() {
    return this._isListening;
  }

  abstract connect(updateInterval: number): void;
  abstract disconnect(): void;
}

export default Game;
