import http from 'http';

import WebSocket from 'ws';

import { LoggerService } from '../../logger/LoggerService';
import gameSource, { GameSource } from '../GameSource';

import { extractFieldsFromObject, getChangedFields } from './helpers';

import { GameData } from '@/main/entities/game';
import { Response } from '@/main/entities/response';

interface Listener {
  socket: WebSocket;
  fields: string[];
  didReceiveDataThisSecond?: boolean;
  previewOnly?: boolean;
}

interface ConstructorProps {
  gameClient?: GameSource;
  server: http.Server;
}

export class WebSocketServer {
  private logger = LoggerService.getLogger('web-socket-server');
  private wss: WebSocket.Server | null = null;
  private listeners: Listener[] = [];
  private gameData: GameData = {
    game: 'None',
    drivers: [],
    realtime: {},
    session: {},
  };
  private mockTick = 0;
  private mockIntervalMs = 100;
  private mockInterval: NodeJS.Timeout | null = null;
  private client: GameSource = gameSource;
  private bytesSentThisPeriod = 0;
  private isPreviewMode = false;

  public start(props: ConstructorProps) {
    const { gameClient = this.client, server } = props;

    this.client = gameClient;

    this.client.addListener('data', data => {
      if (!this.isPreviewMode) {
        this.updateAndSendGameDataUpdateToAllListeners(data);
      }
    });

    setInterval(() => {
      if (this.listeners.length === 0) return;

      const N = this.listeners.length;
      const n = this.listeners.filter(l => l.didReceiveDataThisSecond).length;
      const bytes = this.bytesSentThisPeriod;

      let sizeStr = `${bytes} B`;
      if (bytes >= 1024 * 1024) {
        sizeStr = `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
      } else if (bytes >= 1024) {
        sizeStr = `${(bytes / 1024).toFixed(2)} KB`;
      }

      this.logger.debug(`Sent ${sizeStr} in the last 10 seconds to ${n}/${N} listeners.`);

      this.bytesSentThisPeriod = 0;
      this.listeners.forEach(listener => {
        listener.didReceiveDataThisSecond = false;
      });
    }, 10_000);

    this.mockInterval = setInterval(() => {
      const mockData = this.client.getMock(this.mockTick++);
      if (!mockData || typeof mockData !== 'object') return;

      const updatedData = {
        ...mockData,
        game: this.isGameOpen(mockData) ? mockData.game : 'None',
      };

      this.listeners.forEach(listener => {
        if (!this.shouldReceiveMockData(listener)) return;

        const extractedFields = extractFieldsFromObject(listener.fields, updatedData);
        if (extractedFields.length === 0) return;

        this.sendGameDataToListener(listener, extractedFields);
        listener.didReceiveDataThisSecond = true;
      });

      if (this.isPreviewMode) {
        this.gameData = updatedData;
      }
    }, this.mockIntervalMs);

    this.logger.info('Mock data interval started.');

    if (this.wss) {
      this.logger.warn('WebSocket server is already running.');
      return;
    }

    this.wss = new WebSocket.Server({ server });

    this.wss.on('connection', (socket, request) => {
      try {
        const url = new URL('ws://localhost' + (request.url ?? '/'));
        const query = url.searchParams.get('q');
        const isPreviewOnly = url.searchParams.get('preview') === 'true';

        if (!query) {
          socket.send(Response.failure("'q' parameter is required").toJSON());
          socket.close();
          return;
        }

        const fields = query.split(',');
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

        socket.on('close', () => {
          const listener = this.listeners.find(l => l.socket === socket);
          if (listener) {
            this.logger.info(
              `Disconnected listener with ${fields.length} fields: [${fields.join(', ')}]`,
            );
          }
          this.removeListenerSocket(socket);
        });

        if (this.gameData) {
          const data = extractFieldsFromObject(fields, this.gameData);
          const payload = Response.success(data).toJSON();
          socket.send(payload);
          this.bytesSentThisPeriod += Buffer.byteLength(payload, 'utf8');
        }

        this.addListenerSocket(socket, fields, isPreviewOnly);
        this.logger.info(
          `New listener connected with ${fields.length} fields: [${fields.join(', ')}], previewOnly=${isPreviewOnly ? 'true' : 'false'}`,
        );
      } catch (error) {
        this.logger.error('Error during connection handling:', error);
        if (error instanceof Error) {
          socket.send(Response.failure(error.message).toJSON());
        }
        socket.close();
      }
    });

    this.logger.info(`WebSocket server bound to existing HTTP server`);
  }

  public stop() {
    if (!this.wss) {
      this.logger.warn('WebSocket server is not running.');
      return;
    }

    this.wss.close(() => {
      this.logger.info('WebSocket server stopped.');
    });

    this.listeners.forEach(({ socket }) => socket.close());
    this.listeners = [];
    this.wss = null;

    if (this.mockInterval) {
      clearInterval(this.mockInterval);
      this.mockInterval = null;
    }
  }

  private addListenerSocket(socket: WebSocket, fields: string[], previewOnly = false) {
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

  private isGameOpen(data: GameData) {
    return (
      data.drivers.length > 0 ||
      Object.keys(data.realtime).length > 0 ||
      Object.keys(data.session).length > 0
    );
  }

  private updateAndSendGameDataUpdateToAllListeners(data: GameData) {
    if (this.isPreviewMode) return;

    this.listeners.forEach(listener => {
      if (listener.previewOnly) return;
      const oldData = this.gameData;
      const updatedData = data;
      const extractedFields = getChangedFields(listener.fields, oldData, updatedData);
      if (Object.keys(extractedFields).length !== 0) {
        this.sendGameDataToListener(listener, extractedFields);
        listener.didReceiveDataThisSecond = true;
      }
    });

    this.gameData = {
      ...data,
      game: this.isGameOpen(data) ? data.game : 'None',
    };
  }

  private sendGameDataToListener<T>(listener: Listener, data: T) {
    if (listener.socket.readyState !== WebSocket.OPEN) return;

    const payload = Response.success(data).toJSON();
    listener.socket.send(payload);
    this.bytesSentThisPeriod += Buffer.byteLength(payload, 'utf8');
  }

  public acceptGameData(data: GameData) {
    this.gameData = data;
  }

  public setIsPreview(isPreview: boolean) {
    this.isPreviewMode = isPreview;

    this.logger.info(
      `Preview mode set to ${this.isPreviewMode ? 'true' : 'false'}. ` +
        `PreviewOnly listeners: ${this.listeners.filter(l => l.previewOnly).length}`,
    );
  }

  private shouldReceiveMockData(listener: Listener): boolean {
    return this.isPreviewMode || listener.previewOnly === true;
  }

  get game() {
    return this.gameData?.game || 'none';
  }
}
