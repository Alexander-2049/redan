import { AssetsRouter } from '../features/assets';
import gameSource from '../features/game-source/GameSource';
import { WebSocketServer } from '../features/game-source/web-socket-server';
import { LoggerService } from '../features/logger/LoggerService';
import { OverlaysRouter } from '../features/overlays/OverlaysRouter';
import { HttpServer } from '../infrastructure/http-server';
import { layoutWindowManager } from '../widgets/layout-management';

import { HTTP_SERVER_PORT } from '@/main/shared/constants';

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
  gameSource.selectGame('iRacing');

  // layoutWindowManager.createLayout('JasonStathem.json', {
  //   title: 'Jason Stathem',
  //   game: 'iRacing',
  //   overlays: [],
  //   screen: {
  //     width: 1920,
  //     height: 1080,
  //   },
  // });
  layoutWindowManager.load();
}

main().catch(e => {
  logger.error(e);
});
