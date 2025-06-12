import EmulatorGame from "./games/Emulator/game";
import Game from "./games/game";
import GameDataEmitter from "./games/game-data-emitter";
import iRacing from "./games/iRacing/game";
import { GameName } from "./types/game-name";
import { MappedGameData } from "./types/game-data";
import { REPLAYS_PATH } from "@/main/main-constants";
import fs from "fs";
import path from "path";

const GAME_DATA_UPDATE_INTERVAL = 1000 / 144;

export class GameDataHandler extends GameDataEmitter {
  private game: Game | null = null;
  private _gameName: GameName | null = null;

  private recording: {
    stream: fs.WriteStream;
    firstChunk: boolean;
    lastWriteTime: number;
    frameInterval: number;
  } | null = null;

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
    game.on("data", (data) => {
      this.emit("data", data);
      this.recordData(data);
    });
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

  /**
   * Start recording to a file
   * @param filename - Optional filename (default: 'recording.json')
   * @param fps - Optional recording FPS (default: 10)
   */
  public startRecording(filename = "replay.json", fps = 10) {
    if (this.recording) return;

    if (!fs.existsSync(REPLAYS_PATH)) {
      fs.mkdirSync(REPLAYS_PATH, { recursive: true });
    }

    const filePath = path.join(REPLAYS_PATH, filename);
    const stream = fs.createWriteStream(filePath, { flags: "w" });
    stream.write("[\n");

    this.recording = {
      stream,
      firstChunk: true,
      lastWriteTime: 0,
      frameInterval: 1000 / fps,
    };

    console.log(
      `[GameDataHandler] Started recording to ${filePath} at ${fps} FPS`,
    );
  }

  public stopRecording() {
    if (!this.recording) return;

    const { stream } = this.recording;
    stream.write("\n]");
    stream.end();
    this.recording = null;

    console.log("[GameDataHandler] Stopped recording");
  }

  private recordData(data: MappedGameData) {
    if (!this.recording) return;

    const now = Date.now();
    if (now - this.recording.lastWriteTime < this.recording.frameInterval) {
      return; // Throttle based on desired FPS
    }

    const { stream, firstChunk } = this.recording;
    const json = JSON.stringify(data);

    if (!firstChunk) {
      stream.write(",\n");
    }

    stream.write(json);
    this.recording.firstChunk = false;
    this.recording.lastWriteTime = now;
  }

  public get gameName() {
    return this._gameName;
  }
}

const gameDataHandler = new GameDataHandler();
export const demoGameDataHandler = new GameDataHandler();
demoGameDataHandler.selectGame("Emulator");
export default gameDataHandler;
