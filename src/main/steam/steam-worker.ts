process.on('uncaughtException', () => {
  return;
});
process.on('uncaughtExceptionMonitor', () => {
  return;
});
process.on('unhandledRejection', () => {
  return;
});

import steamworks from 'steamworks.js';

import { SteamWorkerRequest } from './steam-types';

import { STEAM_APP_ID } from '@/shared/constants';

let client: ReturnType<typeof steamworks.init> | null = null;

try {
  client = steamworks.init(STEAM_APP_ID);
  process.parentPort.postMessage({ type: 'connected' });

  setInterval(() => {
    if (client) {
      process.parentPort.postMessage({
        type: 'heartbeat',
        data: { username: client.localplayer.getName() },
      });
    }
  }, 2000);
} catch (err) {
  process.parentPort.postMessage({
    type: 'error',
    error: (err as Error).message,
  });
  process.exit(1);
}

async function handleAction(action: string, args: unknown[]) {
  if (!client) {
    const errorMessage = 'Steam not connected';
    throw new Error(errorMessage);
  }

  switch (action) {
    case 'isOnline':
      return !!client;
    case 'workshop.getAllItems':
      return client.workshop.getAllItems(
        args[0] as number,
        client.workshop.UGCQueryType.RankedByVote,
        client.workshop.UGCType.Items,
        STEAM_APP_ID,
        STEAM_APP_ID,
        {
          cachedResponseMaxAge: 0,
        },
      );
    case 'workshop.subscribe':
      return client.workshop.subscribe(args[0] as bigint);
    case 'workshop.unsubscribe':
      return client.workshop.unsubscribe(args[0] as bigint);
    case 'workshop.getSubscribedItems':
      return client.workshop.getSubscribedItems();
    case 'workshop.download':
      return client.workshop.download(args[0] as bigint, true);
    case 'workshop.downloadInfo':
      return client.workshop.downloadInfo(args[0] as bigint);
    case 'workshop.installInfo':
      return client.workshop.installInfo(args[0] as bigint);
    case 'workshop.getItems':
      return client.workshop.getItems(args[0] as bigint[]);
    default:
      throw new Error(`Unknown action: ${action}`);
  }
}

process.parentPort.on('message', (msg: { data: SteamWorkerRequest; ports: unknown[] }) => {
  handleAction(msg.data.action, msg.data.args || [])
    .then(result => {
      process.parentPort.postMessage({ type: 'response', requestId: msg.data.requestId, result });
    })
    .catch(err => {
      process.parentPort.postMessage({
        type: 'response',
        requestId: msg.data.requestId,
        error: (err as Error).message,
      });
    });
});
