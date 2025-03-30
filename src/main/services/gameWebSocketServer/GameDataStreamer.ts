import { EventEmitter } from "events";
import { IMappedGameData } from "./mapGameData";

export class GameDataStreamer extends EventEmitter {
  private gameData: IMappedGameData | null = null;

  public updateGameData(data: IMappedGameData) {
    this.gameData = data;
    this.emit("data", data); // Emit an event with the updated game data
  }

  public getGameData(): IMappedGameData | null {
    return this.gameData;
  }
}
