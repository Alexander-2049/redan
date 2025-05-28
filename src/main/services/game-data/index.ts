import EmulatorGame from "./games/Emulator/game";
import Game from "./games/Game";
import GameDataEmitter from "./games/GameDataEmitter";
import iRacing from "./games/iRacing/game";
import { GameName } from "./types/GameName";

const GAME_DATA_UPDATE_INTERVAL = 1000 / 144;

class GameDataHandler extends GameDataEmitter {
  private game: Game | null = null;
  private _gameName: GameName | null = null;

  private static readonly games: {
    name: GameName;
    class: new () => Game;
  }[] = [
    { name: "iRacing", class: iRacing },
    { name: "Emulator", class: EmulatorGame },
  ];

  public getSelectedGame() {
    return this._gameName;
  }

  public selectGame(gameName: GameName | null): boolean {
    if (gameName === this._gameName) return false;

    this.disconnectCurrentGame();

    const gameEntry = GameDataHandler.games.find((g) => g.name === gameName);

    if (gameEntry) {
      this.game = new gameEntry.class();
      this._gameName = gameName;
      this.emit("game", this._gameName);
      this.forwardEventsFromGame(this.game);
      this.game.connect(GAME_DATA_UPDATE_INTERVAL);
      return true;
    } else {
      this.game = null;
      this._gameName = gameName;
      this.emit("game", this._gameName);
      return false;
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
