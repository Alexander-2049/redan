import { app } from 'electron';

import { MainWindow } from '../entities/main-window';
import { AssetsRouter } from '../features/assets';
import gameSource from '../features/game-source/GameSource';
import { WebSocketServer } from '../features/game-source/web-socket-server';
import { registerIpcMessageHandlers } from '../features/ipc-bridge';
import { LoggerService } from '../features/logger/LoggerService';
import { OverlayPreviewRouter } from '../features/overlays/OverlayPreviewRouter';
import { OverlaysRouter } from '../features/overlays/OverlaysRouter';
import { SchemasRouter } from '../features/schemas/SchemasRouter';
import { HttpServer } from '../infrastructure/http-server';
import { layoutWindowManager } from '../widgets/layout-management';

import { HTTP_SERVER_PORT } from '@/shared/constants';

const logger = LoggerService.getLogger('main');

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// eslint-disable-next-line @typescript-eslint/require-await
async function main() {
  const routes = [
    { path: '/assets', router: new AssetsRouter().router },
    { path: '/overlays', router: new OverlaysRouter().router },
    { path: '/schemas', router: new SchemasRouter().router },
    { path: '/preview', router: OverlayPreviewRouter.getInstance().router },
  ];

  const httpServer = new HttpServer(HTTP_SERVER_PORT, routes);
  const webSocketServer = new WebSocketServer();

  // Pass existing HTTP server to WebSocketServer (same port)
  webSocketServer.start({
    server: httpServer.server,
  });
  httpServer.start();

  // layoutWindowManager.createLayout('JasonStathem.json', {
  //   title: 'Jason Stathem',
  //   game: 'iRacing',
  //   overlays: [],
  //   screen: {
  //     width: 1920,
  //     height: 1080,
  //   },
  // });

  gameSource.addListener('game', game => {
    layoutWindowManager.load(game || 'None');
  });
  gameSource.selectGame('iRacing');

  app.on('ready', () => {
    const mainWindow = new MainWindow(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, MAIN_WINDOW_WEBPACK_ENTRY);
    registerIpcMessageHandlers();
    mainWindow.load();
  });
}

main().catch((e: unknown) => {
  logger.error(e instanceof Error ? e.message : String(e));
});
