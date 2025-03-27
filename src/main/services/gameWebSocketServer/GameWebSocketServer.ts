import { WEBSOCKET_SERVER_PORT } from "src/shared/constants";
import WebSocket from "ws";

export class GameWebSocketServer {
  private wss = new WebSocket.Server({
    port: WEBSOCKET_SERVER_PORT,
  });

  constructor() {
    this.wss.on("connection", (socket, request) => {
      try {
        const url = new URL(
          "ws://localhost:80" + request.url || "ws://localhost:80/",
        );
        console.log(url.searchParams.get("test"));
        console.log(url.pathname);
      } catch (error) {
        console.error(error);
      }
    });
  }
}
