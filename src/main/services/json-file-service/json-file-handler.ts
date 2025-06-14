/* eslint-disable @typescript-eslint/no-explicit-any */
import { jsonFileServiceLogger as logger } from "@/main/loggers";
import fs from "fs";
import path from "path";

class JsonFileHandler {
  public read<T = any>(filePath: string): T {
    if (!fs.existsSync(filePath)) {
      logger.warn(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const content = fs.readFileSync(filePath, "utf-8");
      const result = JSON.parse(content);
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

    try {
      this.safeWrite(filePath, json);
    } catch (err) {
      logger.error(`Write failed for ${filePath}`, {
        error: err,
      });
    }
  }

  private safeWrite(filePath: string, json: string): void {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, json, "utf-8");
  }
}

export const jsonFileHandler = new JsonFileHandler();
