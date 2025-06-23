import Game from "../game";
import IRacingSDK from "iracing-sdk-2025";
import {
  JsIrSdk,
  SessionInfoEvent,
  TelemetryEvent,
  TelemetryValues,
  SessionInfoData,
} from "iracing-sdk-2025/src/JsIrSdk";
import { mapDataFromIRacing } from "./mapper";
import { fixCarIdxLapCompleted } from "./utils";
import { iRacingMockData } from "./mock";
import { MappedGameData } from "../../types/game-data-schema";

class iRacing extends Game {
  private client: JsIrSdk | null = null;
  private data: { telemetry?: TelemetryValues; sessionInfo?: SessionInfoData } =
    {};

  connect(updateInterval: number): void {
    if (this.client !== null) return;

    this.client = IRacingSDK.init({
      telemetryUpdateInterval: updateInterval,
      sessionInfoUpdateInterval: updateInterval,
    });

    this._isListening = true;

    this.client.addListener("Connected", () => {
      this.isConnected = true;
    });

    this.client.addListener("Disconnected", () => {
      this.isConnected = false;
    });

    this.client.addListener("SessionInfo", (e: SessionInfoEvent) => {
      this.data.sessionInfo = e.data;
    });

    this.client.addListener("Telemetry", (e: TelemetryEvent) => {
      fixCarIdxLapCompleted(e);
      this.data.telemetry = e.data;
      if (!this.data.telemetry || !this.data.sessionInfo) return;

      const mapped = mapDataFromIRacing(
        this.data.telemetry,
        this.data.sessionInfo,
      );
      this.emit("data", mapped); // `isInReplay` & `isOnTrack` auto-updated from GameDataEmitter
    });
  }

  disconnect(): void {
    if (this.client) {
      this.client._stop();
      this.client.removeAllListeners();
      this.client = null;
    }

    this.isConnected = false;
    this._isListening = false;
  }

  getMock(tick: number): MappedGameData {
    return iRacingMockData[tick % iRacingMockData.length];
  }
}

export default iRacing;
