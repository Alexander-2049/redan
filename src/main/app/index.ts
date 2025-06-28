import { HttpServer } from '../infrastructure/http-server';
import { AssetsRouter } from '../features/assets/AssetsRouter';
import { OverlaysRouter } from '../features/overlays/OverlaysRouter';
import { HTTP_SERVER_PORT } from '../shared/constants';

async function main(): Promise<void> {
  const routes = [
    { path: '/assets', router: new AssetsRouter().router },
    { path: '/overlays', router: new OverlaysRouter().router },
  ];

  const httpServer = new HttpServer(HTTP_SERVER_PORT, routes);

  httpServer.start();
}

main().catch(console.error);
