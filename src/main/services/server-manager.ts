import { gameWebSocketServer } from "./game-websocket-server-service";
import { AssetsServer } from "./assets-server-service";
import { OverlayHandler } from "./overlay-service";
import {
  ASSETS_SERVER_PORT,
  OVERLAY_SERVER_PORT,
  WEBSOCKET_SERVER_PORT,
} from "../../shared/shared-constants";
import gameDataHandler from "./game-data";

export const startServers = () => {
  /* WebSocket server with an actual data from games */
  gameWebSocketServer.start({
    port: WEBSOCKET_SERVER_PORT,
    gameClient: gameDataHandler,
  });
  console.log(
    `WebSocket server (real data) is running on port ${WEBSOCKET_SERVER_PORT}`,
  );
  // Remove later
  gameDataHandler.selectGame("iRacing");

  const assetsServer = new AssetsServer(ASSETS_SERVER_PORT);
  assetsServer.start();

  OverlayHandler.server.listen(OVERLAY_SERVER_PORT, "localhost", () => {
    console.log("Overlay server is listening at port: " + OVERLAY_SERVER_PORT);
  });
};
