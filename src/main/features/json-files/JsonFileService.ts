/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from 'fs';
import path from 'path';

import { LoggerService } from '../logger/LoggerService';

export class JsonFileService {
  private static logger = LoggerService.getLogger('json-file-service');

  public static read<T = any>(filePath: string): unknown {
    if (!fs.existsSync(filePath)) {
      this.logger.warn(`File not found: ${filePath}`);
      throw new Error(`File not found: ${filePath}`);
    }

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const result = JSON.parse(content) as T;
      this.logger.info(`Read and parsed file: ${filePath}`);
      return result;
    } catch (err) {
      this.logger.error(`Failed to read or parse JSON file: ${filePath}`, {
        error: err,
      });
      throw new Error(
        `Failed to read or parse JSON file: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  public static write(filePath: string, data: any, prettify = false): void {
    const json = prettify ? JSON.stringify(data, null, 2) : JSON.stringify(data);

    try {
      this.safeWrite(filePath, json);
    } catch (err) {
      this.logger.error(`Write failed for ${filePath}`, {
        error: err,
      });
    }
  }

  public static exists(filePath: string): boolean {
    return fs.existsSync(filePath);
  }

  public static getFilesInDirectory(directoryPath: string): string[] {
    if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
      this.logger.warn(`Directory not found: ${directoryPath}`);
      throw new Error(`Directory not found: ${directoryPath}`);
    }

    try {
      const files = fs
        .readdirSync(directoryPath)
        .filter(file => fs.statSync(path.join(directoryPath, file)).isFile());
      this.logger.info(`Listed files in directory: ${directoryPath}`);
      return files;
    } catch (err) {
      this.logger.error(`Failed to list files in directory: ${directoryPath}`, {
        error: err,
      });
      throw new Error(
        `Failed to list files in directory: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  private static safeWrite(filePath: string, json: string): void {
    const dir = path.dirname(filePath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(filePath, json, 'utf-8');
  }

  public static get path() {
    return path;
  }
}
