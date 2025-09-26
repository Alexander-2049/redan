import { execSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

import VDF from 'vdf';

import { LoggerService } from '../features/logger/LoggerService';

const logger = LoggerService.getLogger('steam-library-folders');

interface LibraryFoldersEntry {
  path?: string;
  [key: string]: unknown;
}

type LibraryFolders = Record<string, LibraryFoldersEntry | string>;

export function findWorkshopContentPath(appId: string | number): string | null {
  const steamLibraryPaths = getSteamLibraryPaths();
  const id = typeof appId === 'number' ? appId.toString() : appId;

  for (const libPath of steamLibraryPaths) {
    const workshopPath = path.join(libPath, 'steamapps', 'workshop', 'content', id);
    if (fs.existsSync(workshopPath)) {
      return workshopPath;
    }
  }

  return null;
}

function getSteamLibraryPaths(): string[] {
  const paths: string[] = [];

  const mainSteamPath = getDefaultSteamPath();
  if (mainSteamPath) {
    paths.push(mainSteamPath);
  }

  const libraryVdfPath = path.join(mainSteamPath || '', 'steamapps', 'libraryfolders.vdf');
  if (fs.existsSync(libraryVdfPath)) {
    try {
      const vdfData = fs.readFileSync(libraryVdfPath, 'utf-8');
      const parsed = VDF.parse(vdfData) as {
        LibraryFolders?: LibraryFolders;
        libraryfolders?: LibraryFolders;
      };

      const libraryFolders = parsed.LibraryFolders ?? parsed.libraryfolders;
      if (libraryFolders) {
        for (const key in libraryFolders) {
          if (!isNaN(Number(key))) {
            const entry = libraryFolders[key];
            if (typeof entry === 'object' && 'path' in entry && typeof entry.path === 'string') {
              paths.push(entry.path.replace(/\\\\/g, '\\'));
            } else if (typeof entry === 'string') {
              paths.push(entry.replace(/\\\\/g, '\\'));
            }
          }
        }
      }
    } catch (err) {
      logger.warn('Failed to parse libraryfolders.vdf:', err);
    }
  }

  return paths;
}

function getDefaultSteamPath(): string | null {
  const platform = os.platform();

  if (platform === 'win32') {
    try {
      const regQuery = execSync('reg query "HKCU\\Software\\Valve\\Steam" /v SteamPath', {
        encoding: 'utf-8',
      });
      const match = regQuery.match(/SteamPath\s+REG_SZ\s+(.+)/);
      if (match) {
        return match[1].trim().replace(/\\/g, '/');
      }
    } catch {
      return path.join(process.env['ProgramFiles(x86)'] || '', 'Steam');
    }
  } else if (platform === 'darwin') {
    return path.join(os.homedir(), 'Library', 'Application Support', 'Steam');
  } else if (platform === 'linux') {
    return path.join(os.homedir(), '.steam', 'steam');
  }

  return null;
}
