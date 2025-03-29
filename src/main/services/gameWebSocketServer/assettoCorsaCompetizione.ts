import AssettoCorsaSDK from "ac-sdk-2025";
import { mapDataFromAssettoCorsaCompetizione } from "./mapGameData";
import { GameDataStreamer } from "./gameDataStreamer";

const client = new AssettoCorsaSDK({
  updateIntervalMs: 1000 / 60,
});

export const accStreamer = new GameDataStreamer();

client.addListener("open", (game) => {
  accStreamer.updateGameData({
    connected: game === "Assetto Corsa Competizione",
    game: "Assetto Corsa Competizione",
    realtime: {},
  });
});

client.addListener("close", () => {
  accStreamer.updateGameData({
    connected: false,
    game: "Assetto Corsa Competizione",
    realtime: {},
  });
});

client.addListener("acc_shared_memory_update", (acc_shared_memory_update) => {
  const mappedData = mapDataFromAssettoCorsaCompetizione(
    true,
    acc_shared_memory_update,
  );
  accStreamer.updateGameData(mappedData);
});
