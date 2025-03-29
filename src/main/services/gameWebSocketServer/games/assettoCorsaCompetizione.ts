import AssettoCorsaSDK, { RealtimeCarAndEntryDataUpdate } from "ac-sdk-2025";
import { mapDataFromAssettoCorsaCompetizione } from "../mapGameData";
import { GameDataStreamer } from "../GameDataStreamer";
import { IAssettoCorsaCompetizioneData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaCompetizioneData";
import { RealtimeUpdate } from "ac-sdk-2025/dist/types/broadcast/interfaces/realtimeUpdate";
import { TrackData } from "ac-sdk-2025/dist/types/broadcast/interfaces/trackData";

const client = new AssettoCorsaSDK({
  updateIntervalMs: 1000 / 60,
  broadcast: {
    password: "connection_password",
  },
});

const acc_data: {
  connected: boolean;
  acc_shared_memory_update?: IAssettoCorsaCompetizioneData;
  acc_udp_cars_update?: RealtimeCarAndEntryDataUpdate[];
  acc_udp_realtime_update?: RealtimeUpdate;
  acc_udp_track_data?: TrackData;
} = {
  connected: false,
};

export const accStreamer = new GameDataStreamer();

client.addListener("open", (game) => {
  accStreamer.updateGameData({
    connected: game === "Assetto Corsa Competizione",
    game: "Assetto Corsa Competizione",
    realtime: {},
    entrylist: [],
  });
});

client.addListener("close", () => {
  accStreamer.updateGameData({
    connected: false,
    game: "Assetto Corsa Competizione",
    realtime: {},
    entrylist: [],
  });
});

client.addListener("acc_shared_memory_update", (acc_shared_memory_update) => {
  acc_data.acc_shared_memory_update = acc_shared_memory_update;

  const mappedData = mapDataFromAssettoCorsaCompetizione(
    true,
    acc_shared_memory_update,
    acc_data.acc_udp_cars_update,
  );
  accStreamer.updateGameData(mappedData);
});

client.addListener("acc_udp_cars_update", (acc_udp_cars_update) => {
  acc_data.acc_udp_cars_update = acc_udp_cars_update;
});

client.addListener("acc_udp_realtime_update", (acc_udp_realtime_update) => {
  acc_data.acc_udp_realtime_update = acc_udp_realtime_update;
});

client.addListener("acc_udp_track_data", (acc_udp_track_data) => {
  acc_data.acc_udp_track_data = acc_udp_track_data;
});
