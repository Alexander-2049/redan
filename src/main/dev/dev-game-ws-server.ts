import { GameWebSocketServer } from "@/main/services/game-websocket-server";
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

gameDataHandler.addListener("connected", () => {
  console.log("Connected to the game!");
});
gameDataHandler.addListener("disconnected", () => {
  console.log("Disconnected from the game!");
});
gameDataHandler.addListener("enteredReplay", () => {
  console.log("Entered replay mode.");
});
gameDataHandler.addListener("exitedReplay", () => {
  console.log("Exited replay mode.");
});
gameDataHandler.addListener("enteredTrack", () => {
  console.log("Entered track.");
});
gameDataHandler.addListener("exitedTrack", () => {
  console.log("Exited track.");
});
