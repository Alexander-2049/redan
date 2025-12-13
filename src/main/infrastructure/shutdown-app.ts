import { app, BrowserWindow } from 'electron';

import { LoggerService } from '../features/logger/LoggerService';
import { layoutWindowManager } from '../widgets/layout-management';

import { httpServer } from './server-runner';

let isQuitting = false;
const logger = LoggerService.getLogger('shutdown');

export function isShutdownInProgress() {
  return isQuitting;
}

export async function shutdownApp() {
  if (isQuitting) return;
  isQuitting = true;

  logger.info('Shutdown started');

  try {
    await httpServer.stop();
  } catch (e) {
    logger.error('HTTP server stop failed', e);
  }

  try {
    layoutWindowManager.destroy();
  } catch (e) {
    logger.error('Window manager destroy failed', e);
  }

  BrowserWindow.getAllWindows().forEach(w => w.destroy());

  logger.info('Shutdown finished');

  process.stdin.pause();
  app.exit(0);
}
