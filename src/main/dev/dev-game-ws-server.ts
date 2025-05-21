import { GameWebSocketServer } from "@/main/services/game-websocket-server";
import gameDataHandler from "../services/game-data";

const client = new GameWebSocketServer();
client.start();
gameDataHandler.selectGame("iRacing");

setTimeout(() => {
  console.log(`Selecting game: null`);
  gameDataHandler.selectGame(null);

  setTimeout(() => {
    console.log(gameDataHandler.gameName);

    console.log(`Selecting game: iRacing`);
    gameDataHandler.selectGame("iRacing");

    console.log(gameDataHandler.gameName);
  }, 1000);
}, 10000);
