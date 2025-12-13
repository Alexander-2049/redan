import { AssetsRouter } from '../features/assets';
import { WebSocketServer } from '../features/game-source/web-socket-server';
import { OverlaysRouter } from '../features/overlays';
import { OverlayPreviewRouter } from '../features/overlays/OverlayPreviewRouter';
import { SchemasRouter } from '../features/schemas/SchemasRouter';

import { HttpServer } from './http-server';

import { HTTP_SERVER_PORT } from '@/shared/constants';

const routes = [
  { path: '/assets', router: new AssetsRouter().router },
  { path: '/overlays', router: new OverlaysRouter().router },
  { path: '/schemas', router: new SchemasRouter().router },
  { path: '/preview', router: OverlayPreviewRouter.getInstance().router },
];

export const httpServer = new HttpServer(HTTP_SERVER_PORT, routes);

export function startServers() {
  const webSocketServer = new WebSocketServer();

  // Pass existing HTTP server to WebSocketServer (same port)
  webSocketServer.start({
    server: httpServer.server,
  });
  httpServer.start();
}
