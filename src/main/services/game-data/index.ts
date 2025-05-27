import Game from "./games/Game";
import GameDataEmitter from "./games/GameDataEmitter";
import iRacing from "./games/iRacing/game";
import { GameName } from "./types/GameName";

const GAME_DATA_UPDATE_INTERVAL = 1000 / 144;

class GameDataHandler extends GameDataEmitter {
  private game: Game | null = null;
  private _gameName: GameName | null = null;

  public selectGame(gameName: GameName | null) {
    if (gameName === this._gameName) return;

    this.disconnectCurrentGame();

    switch (gameName) {
      case "iRacing":
        this.game = new iRacing();
        break;
      default:
        this.game = null;
        break;
    }

    this._gameName = gameName;
    this.emit("game", this._gameName);

    if (this.game) {
      this.forwardEventsFromGame(this.game);
      this.game.connect(GAME_DATA_UPDATE_INTERVAL);
    }
  }

  private forwardEventsFromGame(game: Game) {
    game.on("data", (data) => this.emit("data", data));
    game.on("isConnected", (state) => (this.isConnected = state));
    game.on("isInReplay", (state) => (this.isInReplay = state));
    game.on("isOnTrack", (state) => (this.isOnTrack = state));
  }

  private disconnectCurrentGame() {
    if (this.game) {
      this.game.disconnect();
      this.game.removeAllListeners();
      this.game = null;
    }
  }

  public get gameName() {
    return this._gameName;
  }
}

const gameDataHandler = new GameDataHandler();
export default gameDataHandler;
