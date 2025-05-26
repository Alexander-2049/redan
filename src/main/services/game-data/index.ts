import Game from "./games/Game";
import GameDataEmitter from "./games/GameEventEmitter";
import iRacing from "./games/iRacing/game";
import { GameName } from "./types/GameName";

const GAME_DATA_UPDATE_INTERVAL = 1000 / 144;

class GameDataHandler extends GameDataEmitter {
  private game: Game | null = null;
  private _gameName: GameName | null = null;

  public selectGame(gameName: GameName | null) {
    // If currently connected to the game that we are trying to select
    // then just ignore the call
    if (gameName === this._gameName) return;

    // If currently connected to some game, then disconnect from it
    if (gameName !== this._gameName && this.game) this.game.disconnect();

    switch (gameName) {
      case "iRacing":
        this.game = new iRacing();
        break;
      default:
        this.game = null;
        break;
    }

    this.gameName = gameName;

    if (this.game) {
      this.game.addListener("data", (data) => {
        this.emit("data", data);
      });
      this.game.connect(GAME_DATA_UPDATE_INTERVAL);
    }
  }

  public get gameName() {
    return this._gameName;
  }

  private set gameName(gameName: GameName | null) {
    this._gameName = gameName;
    this.emit("game", gameName);
  }
}

const gameDataHandler = new GameDataHandler();
export default gameDataHandler;
