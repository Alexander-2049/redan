import { GameWebSocketServer } from "./gameServer/GameWebSocketServer";
import AssetsServer from "./assetsServer";
import OverlayHandler from "./overlayService/overlayHandler";
import {
  ASSETS_SERVER_PORT,
  OVERLAY_SERVER_PORT,
} from "../../shared/shared-constants";

export const startServers = () => {
  const gameWsServer = new GameWebSocketServer();
  gameWsServer.start();

  const assetsServer = new AssetsServer(ASSETS_SERVER_PORT);
  assetsServer.start();

  OverlayHandler.server.listen(OVERLAY_SERVER_PORT, "localhost", () => {
    console.log("Overlay server is listening at port: " + OVERLAY_SERVER_PORT);
  });
};
