import { EventEmitter } from "events";
import { MappedGameData } from "../types/GameData";

export default class GameDataEmitter extends EventEmitter {
  on(event: "data", listener: (data: MappedGameData) => void): this;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: string, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  addListener(event: "data", listener: (data: MappedGameData) => void): this;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addListener(event: string, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  emit(event: "data", data: MappedGameData): boolean;
  emit(event: string, ...args: unknown[]): boolean {
    return super.emit(event, ...args);
  }
}
