import WebSocket from "ws";
import { WEBSOCKET_SERVER_PORT } from "../../shared/constants";
import { SelectedGame, WebSocketConnections } from "../types/GamesAPI";
import { ConnectedListeners } from "./ConnectedListeners";

export class GamesWebSocketServerAPI {
  private selectedGame: SelectedGame = "NONE";
  private connections: WebSocketConnections = {
    controls: new ConnectedListeners(),
    rpm: new ConnectedListeners(),
    speed: new ConnectedListeners(),
    state: new ConnectedListeners(),
    sessionInfo: new ConnectedListeners(),
    telemetry: new ConnectedListeners(),
  };
  private webSocketServer = new WebSocket.Server({
    port: WEBSOCKET_SERVER_PORT,
  });

  public get groupNamesLowercase(): Set<string> {
    return new Set(
      Object.keys(this.connections).map((key) => key.toLowerCase())
    );
  }

  constructor() {
    this.webSocketServer.on("error", (error) => {
      console.error(error.message);
    });
    this.webSocketServer.on("connection", (ws, req) => {
      const group = req.url.slice(1).toLowerCase();

      // Find the actual group name in its original case
      const actualGroupName = Object.keys(this.connections).find(
        (key) => key.toLowerCase() === group
      );

      if (actualGroupName) {
        const groupMap =
          this.connections[actualGroupName as keyof WebSocketConnections];
        groupMap.add(ws);

        ws.on("close", () => groupMap.delete(ws));
      } // else {
      //   console.warn(`Group "${group}" does not exist.`);
      // }
    });
  }

  public setSelectedGame(game: SelectedGame) {
    this.selectedGame = game;
  }

  public getSelectedGame() {
    return this.selectedGame;
  }

  public get groups() {
    return this.connections;
  }
}
