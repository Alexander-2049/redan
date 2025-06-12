import { WEBSOCKET_SERVER_PORT } from "../../../shared/shared-constants";
import WebSocket from "ws";
import { MappedGameData } from "../game-data/types/game-data";
import gameDataHandler, { GameDataHandler } from "../game-data";
import { Response } from "./utils/response";
import { extractFieldsFromObject } from "./utils/extractFieldsFromObject";
import { getChangedFields } from "./utils/getChangedFields";

interface Listener {
  socket: WebSocket;
  fields: string[];
}

interface ConstructorProps {
  port?: number;
  gameClient?: GameDataHandler;
}

export class GameWebSocketServer {
  private wss: WebSocket.Server | null = null;
  private listeners: Listener[] = [];
  private gameData: MappedGameData | null = null;
  private client: GameDataHandler = gameDataHandler;
  private port: number = WEBSOCKET_SERVER_PORT;

  constructor(props?: ConstructorProps) {
    this.port = props?.port || this.port;
    this.client = props?.gameClient || this.client;

    this.client.addListener("data", (data) => {
      this.updateAndSendGameDataUpdateToAllListeners(data);
    });
  }

  public start() {
    if (this.wss) {
      console.warn("WebSocket server is already running.");
      return;
    }

    this.wss = new WebSocket.Server({ port: this.port });

    this.wss.on("connection", (socket, request) => {
      try {
        const url = new URL(
          "ws://localhost:" + WEBSOCKET_SERVER_PORT + (request.url ?? "/"),
        );
        const query = url.searchParams.get("q");

        if (!query) {
          socket.send(Response.failure("'q' parameter is required").toJSON());
          socket.close();
          return;
        }

        const fields = query.split(",");
        const maxFields = 30;

        if (fields.length < 1 || fields.length > maxFields) {
          socket.send(
            Response.failure(
              "There must be >1 field and <30 fields listed in 'q' parameter",
            ).toJSON(),
          );
          socket.close();
          return;
        }

        socket.on("close", () => this.removeListenerSocket(socket));

        if (this.gameData) {
          const data = extractFieldsFromObject(fields, this.gameData);
          socket.send(Response.success(data).toJSON());
        }
        this.addListenerSocket(socket, fields);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) {
          socket.send(Response.failure(error.message).toJSON());
        }
        socket.close();
      }
    });

    console.log(`WebSocket server started on port ${WEBSOCKET_SERVER_PORT}`);
  }

  public stop() {
    if (!this.wss) {
      console.warn("WebSocket server is not running.");
      return;
    }

    this.wss.close(() => {
      console.log("WebSocket server stopped.");
    });

    this.listeners.forEach(({ socket }) => socket.close());
    this.listeners = [];
    this.wss = null;
  }

  private addListenerSocket(socket: WebSocket, fields: string[]) {
    this.listeners.push({ socket, fields });
  }

  private removeListenerSocket(socket: WebSocket) {
    this.listeners = this.listeners.filter(({ socket: s }) => s !== socket);
  }

  private updateAndSendGameDataUpdateToAllListeners(data: MappedGameData) {
    this.listeners.forEach((listener) => {
      const oldData = this.gameData;
      const updatedData = data;
      const extractedFields = getChangedFields(
        listener.fields,
        oldData,
        updatedData,
      );
      if (extractedFields.length !== 0)
        this.sendGameDataToListener(listener, extractedFields);
    });
    this.gameData = data;
  }

  private sendGameDataToListener<T>(listener: Listener, data: T) {
    listener.socket.send(Response.success(data).toJSON());
  }

  public acceptGameData(data: MappedGameData) {
    this.gameData = data;
  }

  get game() {
    return this.gameData?.game || "none";
  }
}
