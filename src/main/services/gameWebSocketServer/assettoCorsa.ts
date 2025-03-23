import AssettoCorsaSDK from "ac-sdk-2025";
import { IAssettoCorsaData } from "ac-sdk-2025/dist/types/broadcast/interfaces/AssettoCorsaData";

const client = new AssettoCorsaSDK({
  updateIntervalMs: 1000 / 60,
});

const data: {
  connected: boolean;
  ac_shared_memory_update?: IAssettoCorsaData;
} = {
  connected: false,
};

client.addListener("open", (game) => {
  data.connected = game === "Assetto Corsa";
});

client.addListener("close", () => {
  data.connected = false;
});

client.addListener("ac_shared_memory_update", (ac_shared_memory_update) => {
  data.ac_shared_memory_update = ac_shared_memory_update;
});
