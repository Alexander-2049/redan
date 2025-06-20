import { STEAM_APP_ID } from "@/shared/shared-constants";
import steamworks from "steamworks.js";

let client: ReturnType<typeof steamworks.init> | null = null;

export function initSteamClient() {
  client = steamworks.init(STEAM_APP_ID);
  return client;
}

export function getSteamClient(): ReturnType<typeof steamworks.init> {
  if (!client) {
    throw new Error("Steam client not initialized");
  }
  return client;
}
