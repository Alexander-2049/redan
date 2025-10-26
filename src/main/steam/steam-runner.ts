import { randomUUID } from 'crypto';
import path from 'path';

import { utilityProcess, UtilityProcess, app } from 'electron';

import { LoggerService } from '../features/logger/LoggerService';

import type { SteamWorkerMessage, SteamWorkerRequest } from './steam-types';

const logger = LoggerService.getLogger('steam-runner');
const isDev = !app.isPackaged;

let isQuitting = false;
app.on('before-quit', () => {
  isQuitting = true;
});
export function getIsQuitting() {
  return isQuitting;
}

export function getSteamWorkerPath() {
  return isDev
    ? path.join(__dirname, 'steam-worker.js')
    : path.join(process.resourcesPath, 'app.asar.unpacked', '.webpack', 'main', 'steam-worker.js');
}

let worker: UtilityProcess | null = null;

// ✅ Store generic promises, no any/unknown
const pendingRequests = new Map<
  string,
  { resolve: (res: unknown) => void; reject: (err: Error) => void }
>();

let reconnectTimeout: NodeJS.Timeout | null = null;

export function startSteamWorkerWithReconnect(retryDelay = 5000): UtilityProcess {
  const proc = startSteamWorker();

  proc.on('exit', code => {
    logger.info(`[steam-worker exited with code ${code}]`);
    worker = null;

    if (!getIsQuitting()) {
      logger.info(`🔄 Restarting Steam worker in ${retryDelay / 1000}s...`);
      reconnectTimeout = setTimeout(() => {
        startSteamWorkerWithReconnect(retryDelay);
      }, retryDelay);
    }
  });

  return proc;
}

export function stopSteamWorker() {
  if (reconnectTimeout) {
    clearTimeout(reconnectTimeout);
    reconnectTimeout = null;
  }
  if (worker) {
    worker.kill();
    worker = null;
  }
}

export function startSteamWorker(): UtilityProcess {
  const workerPath = getSteamWorkerPath();
  worker = utilityProcess.fork(workerPath);

  worker.on('message', (msg: SteamWorkerMessage) => {
    if (msg.type === 'response') {
      const entry = pendingRequests.get(msg.requestId);
      if (entry) {
        pendingRequests.delete(msg.requestId);
        if (msg.error) entry.reject(new Error(msg.error));
        else entry.resolve(msg.result);
      }
      return;
    }

    switch (msg.type) {
      case 'connected':
        logger.info('✅ Steam connected');
        break;
      case 'heartbeat':
        // logger.debug('💓 Heartbeat from ' + msg.data.username);
        break;
      case 'error':
        // logger.error('❌ Worker error:', msg.error);
        break;
      case 'shutdown':
        logger.info('👋 Worker requested shutdown');
        break;
    }
  });

  worker.on('spawn', () => {
    logger.info('[steam-worker spawned]');
  });

  worker.on('exit', code => {
    logger.info('[steam-worker exited]', { code });
    worker = null;
  });

  return worker;
}

export async function callSteamWorker<T>(action: string, ...args: unknown[]): Promise<T> {
  if (!worker && action === 'isOnline') return new Promise<T>(res => res(false as T));
  if (!worker && action !== 'isOnline') throw new Error('Steam worker not running');
  return new Promise<T>((resolve, reject) => {
    const requestId = randomUUID();
    // cast here only, not in the interface
    pendingRequests.set(requestId, {
      resolve: res => resolve(res as T),
      reject,
    });
    const msg: SteamWorkerRequest = { requestId, action, args };
    worker && worker.postMessage(msg);
  });
}
