import { WEBSOCKET_SERVER_PORT } from "src/shared/constants";
import WebSocket from "ws";
import { ApiResponse } from "./apiResponse";
import { IMappedGameData } from "./mapGameData";
import { assettoCorsaStreamer } from "./assettoCorsa";
import { accStreamer } from "./assettoCorsaCompetizione";

interface Listener {
  socket: WebSocket;
  fields: string[];
}

export class GameWebSocketServer {
  private wss = new WebSocket.Server({ port: WEBSOCKET_SERVER_PORT });
  private listeners: Listener[] = [];
  private gameData: IMappedGameData | null = null;

  constructor() {
    this.wss.on("connection", (socket, request) => {
      try {
        const url = new URL(
          "ws://localhost:" + WEBSOCKET_SERVER_PORT + (request.url ?? "/"),
        );
        const query = url.searchParams.get("q");

        if (!query) {
          socket.send(
            ApiResponse.failure("'q' parameter is required").toJSON(),
          );
          socket.close();
          return;
        }

        const fields = query.split(",");
        const maxFields = 30;

        if (fields.length < 1 || fields.length > maxFields) {
          socket.send(
            ApiResponse.failure(
              "There must be >1 field and <30 fields listed in 'q' parameter",
            ).toJSON(),
          );
          socket.close();
          return;
        }

        socket.on("close", () => this.removeListenerSocket(socket));

        socket.send(ApiResponse.success(fields).toJSON());
        this.addListenerSocket(socket, fields);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          socket.send(ApiResponse.failure(error.message).toJSON());
        }
        socket.close();
      }
    });

    assettoCorsaStreamer.on("data", (data) => {
      this.updateAndSendGameDataUpdateToAllListeners(data);
    });

    accStreamer.on("data", (data) => {
      this.updateAndSendGameDataUpdateToAllListeners(data);
    });
  }

  private addListenerSocket(socket: WebSocket, fields: string[]) {
    this.listeners.push({ socket, fields });
  }

  private removeListenerSocket(socket: WebSocket) {
    this.listeners = this.listeners.filter(({ socket: s }) => s !== socket);
  }
  private updateAndSendGameDataUpdateToAllListeners(data: IMappedGameData) {
    this.gameData = data;
    this.listeners.forEach((listener) => {
      listener.socket.send(ApiResponse.success(data).toJSON());
    });
  }

  private sendGameDataToListener<T>(listener: Listener, data: T) {
    listener.socket.send(ApiResponse.success(data).toJSON());
  }

  public acceptGameData(data: IMappedGameData) {
    this.gameData = data;
  }

  get game() {
    return this.gameData?.game || "none";
  }
}
