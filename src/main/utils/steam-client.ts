import { STEAM_APP_ID } from "@/shared/shared-constants";
import steamworks from "steamworks.js";
import { steamLogger as logger } from "@/main/loggers";
import fs from "fs";
import path from "path";
import os from "os";
import { execSync } from "child_process";
import VDF from "vdf";

let client: ReturnType<typeof steamworks.init> | null = null;

export function initSteamClient() {
  try {
    client = steamworks.init(STEAM_APP_ID);
    // client.workshop.createItem(STEAM_APP_ID).then(e => {
    //   client?.workshop.updateItem(e.itemId, {

    //   })
    // })
  } catch (error) {
    logger.warn("Steam is failed to initialize");
  }
  return client;
}

export function getSteamClient(): ReturnType<typeof steamworks.init> | null {
  return client;
}

export function isSteamConnected() {
  return !!client;
}

export function findWorkshopContentPath(appId: string | number): string | null {
  const steamLibraryPaths = getSteamLibraryPaths();
  if (typeof appId === "number") appId = appId.toString();

  for (const libPath of steamLibraryPaths) {
    const workshopPath = path.join(
      libPath,
      "steamapps",
      "workshop",
      "content",
      appId,
    );
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

  if (!mainSteamPath) return paths;
  const libraryVdfPath = path.join(
    mainSteamPath,
    "steamapps",
    "libraryfolders.vdf",
  );
  if (fs.existsSync(libraryVdfPath)) {
    try {
      const vdfData = fs.readFileSync(libraryVdfPath, "utf-8");
      const parsed = VDF.parse(vdfData);

      const libraryFolders = parsed.LibraryFolders || parsed.libraryfolders;
      for (const key in libraryFolders) {
        if (!isNaN(Number(key))) {
          const entry = libraryFolders[key];
          if (typeof entry === "object" && entry.path) {
            paths.push(entry.path.replace(/\\\\/g, "\\"));
          } else if (typeof entry === "string") {
            paths.push(entry.replace(/\\\\/g, "\\"));
          }
        }
      }
    } catch (err) {
      console.warn("Failed to parse libraryfolders.vdf:", err);
    }
  }

  return paths;
}

function getDefaultSteamPath(): string | null {
  const platform = os.platform();

  if (platform === "win32") {
    try {
      const regQuery = execSync(
        'reg query "HKCU\\Software\\Valve\\Steam" /v SteamPath',
        { encoding: "utf-8" },
      );
      const match = regQuery.match(/SteamPath\s+REG_SZ\s+(.+)/);
      if (match) {
        return match[1].trim().replace(/\\/g, "/");
      }
    } catch (e) {
      return path.join(process.env["ProgramFiles(x86)"] || "", "Steam");
    }
  } else if (platform === "darwin") {
    return path.join(os.homedir(), "Library", "Application Support", "Steam");
  } else if (platform === "linux") {
    return path.join(os.homedir(), ".steam", "steam");
  }

  return null;
}
