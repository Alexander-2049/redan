import { app } from 'electron';
import installExtension, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-installer';

import buildMeta from '../../../build-meta.json';
import { MainWindow } from '../entities/main-window';
import gameSource from '../features/game-source/GameSource';
import { registerIpcMessageHandlers } from '../features/ipc-bridge';
import { LoggerService } from '../features/logger/LoggerService';
import { startServers } from '../infrastructure/server-runner';
import { isShutdownInProgress, shutdownApp } from '../infrastructure/shutdown-app';
import { IS_DEBUG, IS_DEV } from '../shared/constants';
import { startSteamWorkerWithReconnect } from '../steam/steam-runner';
import { layoutWindowManager } from '../widgets/layout-management';

process.traceProcessWarnings = IS_DEV;

const logger = LoggerService.getLogger('main');

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

// eslint-disable-next-line @typescript-eslint/require-await
async function main() {
  startServers();

  logger.info(`App is running on build: ${buildMeta.buildVersion}`);

  // layoutWindowManager.createLayout('JasonStathem.json', {
  //   title: 'Jason Stathem',
  //   game: 'iRacing',
  //   overlays: [],
  //   screen: {
  //     width: 1920,
  //     height: 1080,
  //   },
  // });

  // PREVENTS FLICKERING WHEN HOVERING CHROMIUM APPS
  // BUT CAUSES LESS PERFORMANCE
  // Hardware Acceleration shares some tasks to GPU
  // WIthouat Hardware Acceleration all calculations are
  // going through CPU
  // app.disableHardwareAcceleration();

  app.on('ready', () => {
    gameSource.addListener('game', game => {
      if (game !== 'None' && game !== null) layoutWindowManager.load(game);
    });
    gameSource.selectGame('iRacing');

    const mainWindow = new MainWindow(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, MAIN_WINDOW_WEBPACK_ENTRY);
    registerIpcMessageHandlers();

    mainWindow.load();

    if (IS_DEV || IS_DEBUG) {
      installExtension(REACT_DEVELOPER_TOOLS, true)
        .then(() => {
          logger.info(`Added extension: ${REACT_DEVELOPER_TOOLS.id}`);
        })
        .catch(err => {
          logger.error('An error occurred: ', err);
        });
    }

    // 🔥 start the Steam worker here
    startSteamWorkerWithReconnect();

    mainWindow.window.on('closed', () => {
      void shutdownApp();
    });
  });

  app.on('before-quit', event => {
    if (isShutdownInProgress()) return;

    logger.info('before-quit');

    event.preventDefault();

    void (async () => {
      await shutdownApp();
      app.exit(0);
    })();
  });
}

main().catch((e: unknown) => {
  logger.error(e instanceof Error ? e.message : String(e));
});
