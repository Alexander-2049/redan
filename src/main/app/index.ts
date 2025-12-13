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

let mainWindow: MainWindow | null = null;

function main() {
  startServers();

  logger.info(`App is running on build: ${buildMeta.buildVersion}`);

  app.on('ready', () => {
    gameSource.addListener('game', game => {
      if (game !== 'None' && game !== null) layoutWindowManager.load(game);
    });
    gameSource.selectGame('iRacing');

    mainWindow = new MainWindow(MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY, MAIN_WINDOW_WEBPACK_ENTRY);
    registerIpcMessageHandlers();

    mainWindow.load();

    if (IS_DEV || IS_DEBUG) {
      installExtension(REACT_DEVELOPER_TOOLS, true)
        .then(() => logger.info(`Added extension: ${REACT_DEVELOPER_TOOLS.id}`))
        .catch(err => logger.error('An error occurred: ', err));
    }

    startSteamWorkerWithReconnect();

    mainWindow.window.on('closed', () => {
      mainWindow = null;
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

// SINGLE INSTANCE LOCK
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  logger.info('Another instance is already running, quitting...');
  app.quit();
} else {
  app.on('second-instance', () => {
    if (mainWindow) {
      const browserWindow = mainWindow.window;
      if (browserWindow.isMinimized()) browserWindow.restore();
      browserWindow.focus();
    }
  });

  // Call main only if this is the first instance
  try {
    main();
  } catch (e: unknown) {
    logger.error(e instanceof Error ? e.message : String(e));
  }
}
