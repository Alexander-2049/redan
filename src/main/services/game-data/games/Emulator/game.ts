import Game from "../Game";
import { MappedGameData, MappedGameDataSchema } from "../../types/GameData";
import { REPLAYS_PATH } from "@/main/main-constants";
import fs from "fs";
import path from "path";
import { z } from "zod";

const TICK_RATE = 100; // 10 FPS

const DEFAULT_REPLAY_PATH = path.join(REPLAYS_PATH, "replay.json");

export default class EmulatorGame extends Game {
  private interval: NodeJS.Timeout | null = null;
  private frame = 0;
  private data: MappedGameData[] = [];

  constructor() {
    super();
    this.setup();
  }

  public setup() {
    this.createReplaysFolder();
    this.loadReplayData(DEFAULT_REPLAY_PATH);
  }

  private createReplaysFolder() {
    if (!fs.existsSync(REPLAYS_PATH)) {
      fs.mkdirSync(REPLAYS_PATH, { recursive: true });
      return true;
    } else {
      return false;
    }
  }

  private loadReplayData(fileName: string) {
    const filePath = path.join(REPLAYS_PATH, fileName);

    try {
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, "utf-8");
        const rawJson = JSON.parse(content);

        const validated = z.array(MappedGameDataSchema).parse(rawJson);
        this.data = validated;

        console.log(
          `[EmulatorGame] Loaded and validated replay data (${this.data.length} frames)`,
        );
      } else {
        console.warn(`[EmulatorGame] Replay file not found at ${filePath}`);
      }
    } catch (err) {
      console.error(
        "[EmulatorGame] Failed to load or validate replay data:",
        err,
      );
    }
  }

  connect(): void {
    if (this.interval || !this.data.length) return;
    this.isConnected = true;

    this.interval = setInterval(() => {
      const current = this.data[this.frame];
      this.emit("data", current);

      this.isInReplay = !!current.realtime.isInReplay;
      this.isOnTrack = !!current.realtime.isOnTrack;

      this.frame++;
      if (this.frame >= this.data.length) {
        this.disconnect(); // end of replay
      }
    }, TICK_RATE);
  }

  disconnect(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.isConnected = false;
    this.frame = 0;
  }
}
