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
      // TODO: Program never gets there
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

  public write(filePath: string, data: any, prettify = false): void {
    const json = prettify
      ? JSON.stringify(data, null, 2)
      : JSON.stringify(data);

    this.safeWrite(filePath, json)
      .then(() => {
        logger.info(`Successfully wrote to file: ${filePath}`);
      })
      .catch((err) => {
        logger.error(`Write operation failed for ${filePath}`, { error: err });
        console.error(`Write operation failed for ${filePath}:`, err);
      });

    this.cache.set(filePath, data);
    this.lastWrite.set(filePath, Date.now());
    logger.debug(`Cache updated for ${filePath}`);
  }

  private async safeWrite(filePath: string, json: string): Promise<void> {
    try {
      const dir = path.dirname(filePath);
      await fsp.mkdir(dir, { recursive: true });
      await fsp.writeFile(filePath, json, "utf-8");
    } catch (err) {
      this.cache.delete(filePath);
      this.lastWrite.delete(filePath);
      logger.error(`Safe write failed for ${filePath}`, { error: err });
      throw err;
    }
  }
}

export const jsonFileHandler = new JsonFileHandler();
