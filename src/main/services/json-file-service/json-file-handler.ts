/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsonFileServiceLogger as logger } from "@/main/loggers";
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
  private pendingWrites: Map<FilePath, Promise<void>> = new Map();
  private debounceTimers: Map<FilePath, NodeJS.Timeout> = new Map();
  private debounceResolvers: Map<FilePath, () => void> = new Map();
  private queuedWrites: Map<FilePath, string> = new Map();

  constructor(fileWriteInterval: TimeMs = 1000) {
    this.fileWriteInterval = fileWriteInterval;
    logger.info(
      `JsonFileHandler initialized with write interval ${fileWriteInterval}ms`,
    );
  }

  public read<T = any>(filePath: string): T {
    const lastWrite = this.lastWrite.get(filePath);
    const cachedData = this.cache.get(filePath);

    if (
      cachedData &&
      lastWrite &&
      Date.now() - lastWrite < this.fileWriteInterval
    ) {
      logger.debug(`Returning cached data for ${filePath}`);
      return cachedData;
    }

    if (!fs.existsSync(filePath)) {
      logger.warn(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const result = JSON.parse(content);
      this.cache.set(filePath, result);
      logger.info(`Read and parsed file: ${filePath}`);
      return result;
    } catch (err) {
      logger.error(`Failed to read or parse JSON file: ${filePath}`, {
        error: err,
      });
      throw new Error(`Failed to read or parse JSON file: ${err}`);
    }
  }

  public write(filePath: string, data: any, prettify = false): Promise<void> {
    const json = prettify
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);

    this.cache.set(filePath, data);
    logger.debug(`Cache updated for ${filePath}`);

    return new Promise<void>((resolve) => {
      this.queuedWrites.set(filePath, json);

      // Clear existing debounce timer
      if (this.debounceTimers.has(filePath)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        clearTimeout(this.debounceTimers.get(filePath)!);
      }

      // Set new debounce timer
      const timer = setTimeout(async () => {
        this.debounceTimers.delete(filePath);
        this.debounceResolvers.delete(filePath);

        const payload = this.queuedWrites.get(filePath);
        if (!payload) return;

        try {
          await this.enqueueWrite(filePath, payload);
          resolve();
        } catch (err) {
          logger.error(`Debounced write failed for ${filePath}`, {
            error: err,
          });
          resolve(); // Still resolve to prevent hanging
        }
      }, this.fileWriteInterval);

      this.debounceTimers.set(filePath, timer);
      this.debounceResolvers.set(filePath, resolve);
    });
  }

  private async enqueueWrite(filePath: string, json: string): Promise<void> {
    const existingWrite = this.pendingWrites.get(filePath) ?? Promise.resolve();

    const newWrite = existingWrite
      .then(() => this.safeWrite(filePath, json))
      .then(() => {
        this.lastWrite.set(filePath, Date.now());
        this.pendingWrites.delete(filePath);
        logger.info(`Successfully wrote to file: ${filePath}`);
      })
      .catch((err) => {
        this.cache.delete(filePath);
        this.lastWrite.delete(filePath);
        this.pendingWrites.delete(filePath);
        logger.error(`Write operation failed for ${filePath}`, { error: err });
        throw err;
      });

    this.pendingWrites.set(filePath, newWrite);
    return newWrite;
  }

  private async safeWrite(filePath: string, json: string): Promise<void> {
    const dir = path.dirname(filePath);
    await fsp.mkdir(dir, { recursive: true });
    await fsp.writeFile(filePath, json, "utf-8");
  }
}

export const jsonFileHandler = new JsonFileHandler();
