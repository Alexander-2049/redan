/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import fsp from "fs/promises";
import path from "path";

type FilePath = string;
type Timestamp = number;
type TimeMs = number;

class JsonFileHandler {
  private fileWriteInterval: TimeMs;
  private cache: Map<FilePath, any> = new Map();
  private lastWrite: Map<FilePath, Timestamp> = new Map();

  constructor(fileWriteInterval: TimeMs = 1000) {
    this.fileWriteInterval = fileWriteInterval;
  }

  public read<T = any>(filePath: string): T {
    const lastWrite = this.lastWrite.get(filePath);
    const cachedData = this.cache.get(filePath);
    if (
      cachedData &&
      lastWrite &&
      Date.now() - lastWrite < this.fileWriteInterval
    ) {
      return cachedData;
    }

    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const result = JSON.parse(content);
      this.cache.set(filePath, result);
      return result;
    } catch (err) {
      throw new Error(`Failed to read or parse JSON file: ${err}`);
    }
  }

  public write(filePath: string, data: any, prettify = false): void {
    const json = prettify
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);

    this.safeWrite(filePath, json).catch((err) => {
      console.error(`Write operation failed for ${filePath}:`, err);
    });

    this.cache.set(filePath, data);
    this.lastWrite.set(filePath, Date.now());
  }

  private async safeWrite(filePath: string, json: string): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      await fsp.mkdir(dir, { recursive: true });
      await fsp.writeFile(filePath, json, "utf-8");
    } catch (err) {
      this.cache.delete(filePath);
      this.lastWrite.delete(filePath);
      throw err;
    }
  }
}

export const jsonFileHandler = new JsonFileHandler();
