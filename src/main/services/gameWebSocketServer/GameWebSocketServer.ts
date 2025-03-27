import { WEBSOCKET_SERVER_PORT } from "src/shared/constants";
import WebSocket from "ws";

export class GameWebSocketServer {
  private wss = new WebSocket.Server({
    port: WEBSOCKET_SERVER_PORT,
  });

  constructor() {
    this.wss.on("connection", (socket, request) => {
      console.log(request.url);
    });
  }
}
