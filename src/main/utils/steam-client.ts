import { STEAM_APP_ID } from "@/shared/shared-constants";
import steamworks from "steamworks.js";
import { steamLogger as logger } from "@/main/loggers";

let client: ReturnType<typeof steamworks.init> | null = null;

export function initSteamClient() {
  try {
    client = steamworks.init(STEAM_APP_ID);
  } catch (error) {
    logger.warn("Steam is failed to initialize");
  }
  return client;
}

export function getSteamClient(): ReturnType<typeof steamworks.init> | null {
  return client;
}
