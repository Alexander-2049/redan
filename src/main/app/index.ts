import { AssetsRouter } from '../features/assets';
import { WebSocketServer } from '../features/game-source/web-socket-server';
import { LoggerService } from '../features/logger/LoggerService';
import { OverlaysRouter } from '../features/overlays/OverlaysRouter';
import { HttpServer } from '../infrastructure/http-server';

import { HTTP_SERVER_PORT } from '@/shared/constants';

const logger = LoggerService.getLogger('main');

// eslint-disable-next-line @typescript-eslint/require-await
async function main() {
  const routes = [
    { path: '/assets', router: new AssetsRouter().router },
    { path: '/overlays', router: new OverlaysRouter().router },
  ];

  const httpServer = new HttpServer(HTTP_SERVER_PORT, routes);
  const webSocketServer = new WebSocketServer();
  httpServer.start();

  // Pass existing HTTP server to WebSocketServer (same port)
  webSocketServer.start({
    server: httpServer.server,
  });
}

main().catch(e => {
  logger.error(e);
});
