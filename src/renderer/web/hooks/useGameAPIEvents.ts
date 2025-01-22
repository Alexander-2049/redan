import { useState, useEffect, useMemo } from "react";
import { WEBSOCKET_SERVER_PORT } from "../../../shared/constants";
import { GameAPI } from "../utils/GameAPI";

/**
 * Custom hook to manage GameAPI event listeners and state for given events.
 *
 * @param {string[]} events - Array of event names to listen to.
 * @returns {Record<string, unknown>} - Object with the latest state for each event.
 */
export const useGameAPIEvents = (events: string[]): Record<string, unknown> => {
  const api = useMemo(() => new GameAPI(WEBSOCKET_SERVER_PORT), []);

  // State is explicitly typed as a Record where keys are strings, and values can be of any type (unknown).
  const [state, setState] = useState<Record<string, unknown>>(() =>
    events.reduce((acc, event) => {
      acc[event] = null;
      return acc;
    }, {} as Record<string, unknown>)
  );

  useEffect(() => {
    const updateState = (event: string) => (value: unknown) => {
      setState((prevState) => ({
        ...prevState,
        [event]: value,
      }));
    };

    // Add event listeners
    events.forEach((event) => {
      api.addEventListener(event, updateState(event));
    });

    // Cleanup: Remove event listeners
    return () => {
      events.forEach((event) => {
        api.removeEventListener(event, updateState(event));
      });
    };
  }, [api, events]);

  return state;
};

export default useGameAPIEvents;
