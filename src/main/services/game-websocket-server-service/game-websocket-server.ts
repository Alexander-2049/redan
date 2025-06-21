import { WEBSOCKET_SERVER_PORT } from "../../../shared/shared-constants";
import WebSocket from "ws";
import { MappedGameData } from "../game-data/types/game-data-schema";
import gameDataHandler, { GameDataHandler } from "../game-data";
import { Response } from "./utils/response";
import { extractFieldsFromObject } from "./utils/extractFieldsFromObject";
import { getChangedFields } from "./utils/getChangedFields";
import { gameWebsocketServerService as logger } from "@/main/loggers";

interface Listener {
  socket: WebSocket;
  fields: string[];
  didReceiveDataThisSecond?: boolean;
}

interface ConstructorProps {
  port?: number;
  gameClient?: GameDataHandler;
}

export class GameWebSocketServer {
  private wss: WebSocket.Server | null = null;
  private listeners: Listener[] = [];
  private gameData: MappedGameData = {
    game: "None",
    drivers: [],
    realtime: {},
    session: {},
  };
  private client: GameDataHandler = gameDataHandler;
  private port: number = WEBSOCKET_SERVER_PORT;
  private bytesSentThisSecond = 0;

  constructor(props?: ConstructorProps) {
    this.port = props?.port || this.port;
    this.client = props?.gameClient || this.client;

    this.client.addListener("data", (data) => {
      this.updateAndSendGameDataUpdateToAllListeners(data);
    });

    // Set up interval for logging bytes sent per second
    setInterval(() => {
      if (this.listeners.length === 0) return;

      const N = this.listeners.length;
      const n = this.listeners.filter((l) => l.didReceiveDataThisSecond).length;
      const bytes = this.bytesSentThisSecond;

      let sizeStr = `${bytes} B`;
      if (bytes >= 1024 * 1024) {
        sizeStr = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      } else if (bytes >= 1024) {
        sizeStr = `${(bytes / 1024).toFixed(2)} KB`;
      }

      logger.debug(`Sent ${sizeStr} this second to ${n}/${N} listeners.`);

      // Reset counters and flags
      this.bytesSentThisSecond = 0;
      this.listeners.forEach((listener) => {
        listener.didReceiveDataThisSecond = false;
      });
    }, 1000);
  }

  public start() {
    if (this.wss) {
      logger.warn("WebSocket server is already running.");
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

        socket.on("close", () => {
          const listener = this.listeners.find((l) => l.socket === socket);
          if (listener) {
            logger.info(
              `Disconnected listener with ${fields.length} fields: [${fields.join(", ")}]`,
            );
          }
          this.removeListenerSocket(socket);
        });

        if (this.gameData) {
          const data = extractFieldsFromObject(fields, this.gameData);
          const payload = Response.success(data).toJSON();
          socket.send(payload);
          this.bytesSentThisSecond += Buffer.byteLength(payload, "utf8");
        }

        this.addListenerSocket(socket, fields);
        logger.info(
          `New listener connected with ${fields.length} fields: [${fields.join(", ")}]`,
        );
      } catch (error) {
        logger.error("Error during connection handling:", error);
        if (error instanceof Error) {
          socket.send(Response.failure(error.message).toJSON());
        }
        socket.close();
      }
    });

    logger.info(`WebSocket server started on port ${this.port}`);
  }

  public stop() {
    if (!this.wss) {
      logger.warn("WebSocket server is not running.");
      return;
    }

    this.wss.close(() => {
      logger.info("WebSocket server stopped.");
    });

    this.listeners.forEach(({ socket }) => socket.close());
    this.listeners = [];
    this.wss = null;
  }

  private addListenerSocket(socket: WebSocket, fields: string[]) {
    this.listeners.push({ socket, fields, didReceiveDataThisSecond: false });
  }

  private removeListenerSocket(socket: WebSocket) {
    this.listeners = this.listeners.filter(({ socket: s }) => s !== socket);
  }

  private isGameOpen(data: MappedGameData) {
    return (
      data.drivers.length > 0 ||
      Object.keys(data.realtime).length > 0 ||
      Object.keys(data.session).length > 0
    );
  }

  private updateAndSendGameDataUpdateToAllListeners(data: MappedGameData) {
    this.listeners.forEach((listener) => {
      const oldData = this.gameData;
      const updatedData = {
        ...data,
        game: this.isGameOpen(data) ? data.game : "None",
      };
      const extractedFields = getChangedFields(
        listener.fields,
        oldData,
        updatedData,
      );
      if (extractedFields.length !== 0) {
        this.sendGameDataToListener(listener, extractedFields);
        listener.didReceiveDataThisSecond = true;
      }
    });
    this.gameData = {
      ...data,
      game: this.isGameOpen(data) ? data.game : "None",
    };
  }

  private sendGameDataToListener<T>(listener: Listener, data: T) {
    if (listener.socket.readyState !== WebSocket.OPEN) return;

    const payload = Response.success(data).toJSON();
    listener.socket.send(payload);
    this.bytesSentThisSecond += Buffer.byteLength(payload, "utf8");
  }

  public acceptGameData(data: MappedGameData) {
    this.gameData = data;
  }

  get game() {
    return this.gameData?.game || "none";
  }
}
