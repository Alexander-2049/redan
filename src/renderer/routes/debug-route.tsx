import { useEffect, useMemo, useRef, useState } from 'react';

import { ScrollArea } from '../components/ui/scroll-area';

import { GameData } from '@/main/entities/game';

type WireGameData = {
  session: GameData['session'];
  realtime: GameData['realtime'];
  drivers: GameData['drivers'];
};

function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isEntry(value: unknown): value is [string, unknown] {
  return Array.isArray(value) && value.length === 2 && typeof value[0] === 'string';
}

function isWireGameData(data: Partial<WireGameData>): data is WireGameData {
  return data.session !== undefined && data.realtime !== undefined && data.drivers !== undefined;
}

const useGameData = (): { data: GameData | null; error: string | null } => {
  const url = 'ws://localhost:42049';

  const params = useMemo(() => ['session', 'realtime', 'drivers'], []);

  const [data, setData] = useState<GameData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const accumulatedRef = useRef<Partial<WireGameData>>({});
  const hasSnapshotRef = useRef(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isUnmounted = false;

    const connect = () => {
      const isPreview = /\bpreview(\b|=true)/.test(window.location.search);
      const queryParams = `?preview=${isPreview ? 'true' : 'false'}&q=${params.join(',')}`;
      const ws = new WebSocket(`${url}${queryParams}`);

      socketRef.current = ws;

      ws.onopen = () => {
        if (!isUnmounted) {
          setError(null);
        }
      };

      ws.onmessage = event => {
        try {
          if (typeof event.data !== 'string') {
            return;
          }

          const parsed: unknown = JSON.parse(event.data);

          if (!isObject(parsed)) {
            return;
          }

          const { success, data: payload, errorMessage } = parsed;

          if (success === true && payload !== undefined && payload !== null) {
            let incoming: Partial<WireGameData> = {};

            if (Array.isArray(payload)) {
              const entries = payload.filter(isEntry);
              incoming = Object.fromEntries(entries);
            } else if (isObject(payload)) {
              incoming = payload;
            }

            accumulatedRef.current = {
              ...accumulatedRef.current,
              ...incoming,
            };

            if (!hasSnapshotRef.current) {
              if (isWireGameData(accumulatedRef.current)) {
                hasSnapshotRef.current = true;

                setData({
                  game: 'iRacing',
                  ...accumulatedRef.current,
                });
              }
            } else {
              setData(prev => (prev ? { ...prev, ...accumulatedRef.current } : null));
            }
          } else if (typeof errorMessage === 'string') {
            setError(errorMessage);
          }
        } catch {
          setError('Failed to parse WebSocket message');
        }
      };

      ws.onerror = () => {
        if (!isUnmounted) {
          setError('WebSocket error occurred');
        }
      };

      ws.onclose = () => {
        if (!isUnmounted) {
          reconnectTimeoutRef.current = setTimeout(connect, 5000);
        }
      };
    };

    connect();

    return () => {
      isUnmounted = true;

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }

      socketRef.current?.close();
    };
  }, [params, url]);

  return { data, error };
};

const DebugRoute = () => {
  const { data, error } = useGameData();

  return (
    <ScrollArea className="h-full w-full overflow-auto">
      <pre>
        <code className="h-full w-full">{JSON.stringify({ data, error }, null, 2)}</code>
      </pre>
    </ScrollArea>
  );
};

export default DebugRoute;
