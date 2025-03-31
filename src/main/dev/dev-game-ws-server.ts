import { GameWebSocketServer } from "@main/services/gameWebSocketServer/GameWebSocketServer";

const client = new GameWebSocketServer();
client.start();
