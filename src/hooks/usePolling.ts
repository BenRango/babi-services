import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

/**
 * Recharge `callback` immédiatement puis toutes les `intervalMs` tant que
 * l'écran est au premier plan — approximation front d'un flux "temps réel"
 * en l'absence de WebSocket/SSE côté backend.
 */
export function usePolling(callback: () => void, intervalMs: number) {
  useFocusEffect(
    useCallback(() => {
      callback();
      const interval = setInterval(callback, intervalMs);
      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, intervalMs])
  );
}
