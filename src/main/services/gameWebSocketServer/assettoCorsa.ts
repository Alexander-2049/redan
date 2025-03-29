import AssettoCorsaSDK from "ac-sdk-2025";
import { mapDataFromAssettoCorsa } from "./mapGameData";
import { GameDataStreamer } from "./gameDataStreamer";

const client = new AssettoCorsaSDK({
  updateIntervalMs: 1000 / 60,
});

export const assettoCorsaStreamer = new GameDataStreamer();

client.addListener("open", (game) => {
  assettoCorsaStreamer.updateGameData({
    connected: game === "Assetto Corsa",
    game: "Assetto Corsa",
    realtime: {},
  });
});

client.addListener("close", () => {
  assettoCorsaStreamer.updateGameData({
    connected: false,
    game: "Assetto Corsa",
    realtime: {},
  });
});

client.addListener("ac_shared_memory_update", (ac_shared_memory_update) => {
  const mappedData = mapDataFromAssettoCorsa(true, ac_shared_memory_update);
  assettoCorsaStreamer.updateGameData(mappedData);
});
