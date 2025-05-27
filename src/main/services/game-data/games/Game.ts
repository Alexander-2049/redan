import GameDataEmitter from "./GameEventEmitter";

class Game extends GameDataEmitter {
  protected _isListening = false;

  get isListening() {
    return this._isListening;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  connect(updateInterval: number): void {
    return;
  }

  disconnect(): void {
    return;
  }
}

export default Game;
