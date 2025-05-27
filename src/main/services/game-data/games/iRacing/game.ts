import Game from "../Game";
import IRacingSDK from "iracing-sdk-2025";
import {
  JsIrSdk,
  SessionInfoData,
  SessionInfoEvent,
  TelemetryEvent,
  TelemetryValues,
} from "iracing-sdk-2025/src/JsIrSdk";
import { mapDataFromIRacing } from "./mapper";

class iRacing extends Game {
  private client: JsIrSdk | null = null;
  private data: {
    telemetry?: TelemetryValues;
    sessionInfo?: SessionInfoData;
  } = {};

  connect(updateInterval: number): void {
    if (this.client === null) {
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

      this.client.addListener(
        "SessionInfo",
        (sessionInfoEvent: SessionInfoEvent) => {
          this.data.sessionInfo = sessionInfoEvent.data;
        },
      );

      this.client.addListener("Telemetry", (telemetryEvent: TelemetryEvent) => {
        this.data.telemetry = telemetryEvent.data;

        // To map all data from both Telemetry and SessionInfo
        // we will skip one iteration of mapping data
        if (!this.data.telemetry || !this.data.sessionInfo) return;

        this.emit(
          "data",
          mapDataFromIRacing(
            this.isConnected,
            this.data.telemetry,
            this.data.sessionInfo,
          ),
        );
      });
    }
  }

  disconnect(): void {
    if (this.client !== null) {
      this.client._stop();
      this.client.removeAllListeners();
      this.client = null;
      this.isConnected = false;
      this._isListening = false;
    }
  }
}

export default iRacing;
