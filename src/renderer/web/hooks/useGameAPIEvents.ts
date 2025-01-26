import { useState, useEffect, useMemo, useRef } from "react";
import { WEBSOCKET_SERVER_PORT } from "../../../shared/constants";
import { GameAPI } from "../utils/GameAPI";

/**
 * Custom hook to manage GameAPI event listeners and throttled state updates for given events.
 *
 * @param {string[]} events - Array of event names to listen to.
 * @returns {Record<string, unknown>} - Object with the throttled state for each event.
 */
export const useGameAPIEvents = (events: string[]): Record<string, unknown> => {
  const api = useMemo(() => new GameAPI(WEBSOCKET_SERVER_PORT), []);

  // The raw state for each event (updated as frequently as events occur).
  const rawStateRef = useRef<Record<string, unknown>>(
    events.reduce((acc, event) => {
      acc[event] = null;
      return acc;
    }, {} as Record<string, unknown>)
  );

  // The throttled state exposed to the consumer of the hook.
  const [state, setState] = useState<Record<string, unknown>>(() =>
    events.reduce((acc, event) => {
      acc[event] = null;
      return acc;
    }, {} as Record<string, unknown>)
  );

  useEffect(() => {
    const updateRawState = (event: string) => (value: unknown) => {
      rawStateRef.current[event] = value;
    };

    // Add event listeners
    events.forEach((event) => {
      api.addEventListener(event, updateRawState(event));
    });

    // Cleanup: Remove event listeners
    return () => {
      events.forEach((event) => {
        api.removeEventListener(event, updateRawState(event));
      });
    };
  }, [api, events]);

  useEffect(() => {
    // Throttled update loop
    const interval = setInterval(() => {
      setState(() => {
        const updatedState = { ...rawStateRef.current };
        return updatedState;
      });
    }, 1000 / 60); // Approximately 16.67ms (1/60th of a second)

    return () => clearInterval(interval);
  }, []);

  return state;
};

export default useGameAPIEvents;
