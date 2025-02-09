import { EventEmitter } from "events";
import {
  ConnectedMessage,
  iRacingMessage,
  SessionInfoMessage,
  TelemetryMessage,
} from "../../../shared/types/iRacingMessage";
import path from "path";
import { RESOURCES_PATH } from "../../constants";
import { ChildProcess, spawn } from "child_process";

const exePath = path.join(RESOURCES_PATH, "irsdk-ipc.exe");

export type iRacingSDKEventName =
  | "telemetry"
  | "sessionInfo"
  | "connected"
  | "close"
  | "spawn";

export class iRacingSDK extends EventEmitter {
  private irsdkipc: ChildProcess | null;
  private connectedInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.irsdkipc = null;
  }

  open() {
    this.kill();
    this.irsdkipc = spawn(exePath, {
      stdio: ["pipe", "pipe", "pipe", "ipc"],
    });

    this.irsdkipc.on("spawn", () => {
      this.connectedInterval = setInterval(() => {
        if (this.irsdkipc) this.irsdkipc.send("connected");
      });
    });

    this.irsdkipc.on("message", (message) => {
      if (!this.isValidMessage(message)) {
        console.warn("Received invalid message:", message);
        return;
      }
      const typedMessage = message as iRacingMessage;

      const relation: Record<iRacingMessage["type"], iRacingSDKEventName> = {
        Connected: "connected",
        SessionInfo: "sessionInfo",
        Telemetry: "telemetry",
      };

      const eventName = relation[typedMessage.type];

      this.emit(eventName, typedMessage);
    });
  }

  kill() {
    if (this.connectedInterval !== null) clearInterval(this.connectedInterval);
    if (this.irsdkipc) this.irsdkipc.kill();
    this.irsdkipc = null;
  }

  on(event: "telemetry", callback: (message: TelemetryMessage) => void): this;
  on(
    event: "sessionInfo",
    callback: (message: SessionInfoMessage) => void
  ): this;
  on(event: "connected", callback: (message: ConnectedMessage) => void): this;
  on(event: "close" | "spawn", callback: () => void): this;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  on(event: iRacingSDKEventName, callback: (...args: any[]) => void): this {
    return super.on(event, callback);
  }

  private isValidMessage(message: unknown): message is iRacingMessage {
    return (
      typeof message === "object" &&
      message !== null &&
      "type" in message &&
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ["Telemetry", "SessionInfo", "Connected"].includes((message as any).type)
    );
  }
}
