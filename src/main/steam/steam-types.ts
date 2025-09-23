// Messages coming *from* worker
export type SteamWorkerMessage =
  | { type: 'connected' }
  | { type: 'heartbeat'; data: { username: string } }
  | { type: 'error'; error: string }
  | { type: 'shutdown' }
  | { type: 'response'; requestId: string; result: unknown; error?: string };

// Messages going *to* worker
export type SteamWorkerRequest = {
  requestId: string;
  action: string; // e.g. "workshop.getAllItems"
  args?: unknown[];
};
