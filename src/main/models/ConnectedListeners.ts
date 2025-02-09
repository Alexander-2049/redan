import { ObjectOptions } from "../types/GamesAPI";
import WebSocket from "ws";

export class ConnectedListeners<T extends ObjectOptions> {
  private listeners: Set<WebSocket> = new Set();
  private lastMessageStringified: string | null = null;

  public add(ws: WebSocket) {
    this.listeners.add(ws);

    // Even if Game Client is closed our listener will receive a last state
    if (this.lastMessageStringified !== null)
      ws.send(this.lastMessageStringified);
  }

  public delete(ws: WebSocket) {
    this.listeners.delete(ws);
  }

  public send(message: T) {
    const messageStringified = JSON.stringify(message);
    if (this.lastMessageStringified === messageStringified) return;

    this.lastMessageStringified = messageStringified;

    this.listeners.forEach((ws) => {
      ws.send(messageStringified);
    });
  }
}
