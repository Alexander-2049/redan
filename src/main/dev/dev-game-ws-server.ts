import { GameWebSocketServer } from "@/main/services/gameServer/GameWebSocketServer";

const client = new GameWebSocketServer();
client.start();
