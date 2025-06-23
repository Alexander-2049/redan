import { WEBSOCKET_SERVER_PORT } from "../../../shared/shared-constants";
import WebSocket from "ws";
import { MappedGameData } from "../game-data/types/game-data-schema";
import gameDataHandler, { GameDataHandler } from "../game-data";
import { Response } from "./utils/response";
import { extractFieldsFromObject } from "./utils/extractFieldsFromObject";
import { getChangedFields } from "./utils/getChangedFields";
import { gameWebsocketServerServiceLogger as logger } from "@/main/loggers";

interface Listener {
  socket: WebSocket;
  fields: string[];
  didReceiveDataThisSecond?: boolean;
  previewOnly?: boolean;
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
  private mockTick = 0;
  private mockIntervalMs = 400;
  private mockInterval: NodeJS.Timeout | null = null;
  private client: GameDataHandler = gameDataHandler;
  private port: number = WEBSOCKET_SERVER_PORT;
  private bytesSentThisPeriod = 0;
  private isPreviewMode = false;

  public start(props?: ConstructorProps) {
    this.port = props?.port || this.port;
    this.client = props?.gameClient || this.client;

    this.client.addListener("data", (data) => {
      if (!this.isPreviewMode) {
        this.updateAndSendGameDataUpdateToAllListeners(data);
      }
    });

    // Log bandwidth usage for both mock and real data every 10 seconds
    setInterval(() => {
      if (this.listeners.length === 0) return;

      const N = this.listeners.length;
      const n = this.listeners.filter((l) => l.didReceiveDataThisSecond).length;
      const bytes = this.bytesSentThisPeriod;

      let sizeStr = `${bytes} B`;
      if (bytes >= 1024 * 1024) {
        sizeStr = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      } else if (bytes >= 1024) {
        sizeStr = `${(bytes / 1024).toFixed(2)} KB`;
      }

      logger.debug(
        `Sent ${sizeStr} in the last 10 seconds to ${n}/${N} listeners.`,
      );

      this.bytesSentThisPeriod = 0;
      this.listeners.forEach((listener) => {
        listener.didReceiveDataThisSecond = false;
      });
    }, 10_000);

    // Always-running mock interval
    this.mockInterval = setInterval(() => {
      const mockData = this.client.getMock(this.mockTick++);
      if (!mockData || typeof mockData !== "object") return;

      const updatedData = {
        ...mockData,
        game: this.isGameOpen(mockData) ? mockData.game : "None",
      };

      this.listeners.forEach((listener) => {
        if (!this.shouldReceiveMockData(listener)) return;

        const extractedFields = extractFieldsFromObject(
          listener.fields,
          updatedData,
        );

        this.sendGameDataToListener(listener, extractedFields);
        listener.didReceiveDataThisSecond = true;
      });

      if (this.isPreviewMode) {
        this.gameData = updatedData;
      }
    }, this.mockIntervalMs);

    logger.info("Mock data interval started.");

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
        const isPreviewOnly = url.searchParams.get("preview") === "true";

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
          this.bytesSentThisPeriod += Buffer.byteLength(payload, "utf8");
        }

        this.addListenerSocket(socket, fields, isPreviewOnly);
        logger.info(
          `New listener connected with ${fields.length} fields: [${fields.join(", ")}], previewOnly=${isPreviewOnly}`,
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

    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  private addListenerSocket(
    socket: WebSocket,
    fields: string[],
    previewOnly = false,
  ) {
    this.listeners.push({
      socket,
      fields,
      previewOnly,
      didReceiveDataThisSecond: false,
    });
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
    if (this.isPreviewMode) return;

    this.listeners.forEach((listener) => {
      if (listener.previewOnly) return;
      const oldData = this.gameData;
      const updatedData = data;
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
    this.bytesSentThisPeriod += Buffer.byteLength(payload, "utf8");
  }

  public acceptGameData(data: MappedGameData) {
    this.gameData = data;
  }

  public setIsPreview(isPreview: boolean) {
    this.isPreviewMode = isPreview;

    logger.info(
      `Preview mode set to ${this.isPreviewMode}. ` +
        `PreviewOnly listeners: ${this.listeners.filter((l) => l.previewOnly).length}`,
    );
  }

  private shouldReceiveMockData(listener: Listener): boolean {
    return this.isPreviewMode || listener.previewOnly === true;
  }

  get game() {
    return this.gameData?.game || "none";
  }
}

export const gameWebSocketServer = new GameWebSocketServer();
