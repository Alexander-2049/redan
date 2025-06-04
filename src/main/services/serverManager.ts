import { GameWebSocketServer } from "./game-websocket-server";
import AssetsServer from "./assetsServer";
import OverlayHandler from "./overlayService/overlayHandler";
import {
  ASSETS_SERVER_PORT,
  OVERLAY_SERVER_PORT,
  WEBSOCKET_SERVER_DEMO_PORT,
  WEBSOCKET_SERVER_PORT,
} from "../../shared/shared-constants";
import gameDataHandler, { demoGameDataHandler } from "./game-data";

export const startServers = () => {
  /* WebSocket server with an actual data from games */
  const gameWsServer = new GameWebSocketServer({
    port: WEBSOCKET_SERVER_PORT,
    gameClient: gameDataHandler,
  });
  gameWsServer.start();
  console.log(
    `WebSocket server (real data) is running on port ${WEBSOCKET_SERVER_PORT}`,
  );
  // Remove later
  gameDataHandler.selectGame("iRacing");

  /* WebSocket server with demo data for overlay previews */
  const demoGameWsServer = new GameWebSocketServer({
    port: WEBSOCKET_SERVER_DEMO_PORT,
    gameClient: demoGameDataHandler,
  });
  demoGameWsServer.start();
  console.log(
    `WebSocket server (demo data) is running on port ${WEBSOCKET_SERVER_DEMO_PORT}`,
  );

  const assetsServer = new AssetsServer(ASSETS_SERVER_PORT);
  assetsServer.start();

  OverlayHandler.server.listen(OVERLAY_SERVER_PORT, "localhost", () => {
    console.log("Overlay server is listening at port: " + OVERLAY_SERVER_PORT);
  });
};
