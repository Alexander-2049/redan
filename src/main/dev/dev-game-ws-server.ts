import { GameWebSocketServer } from "@/main/services/game-websocket-server-service";
import gameDataHandler from "../services/game-data";

const client = new GameWebSocketServer();
client.start();
gameDataHandler.selectGame("iRacing");

// let last = "";
// gameDataHandler.addListener("data", (data) => {
//   const current = JSON.stringify(data);
//   if (current === last) return;

//   last = current;
//   console.log(data.drivers);
// });
