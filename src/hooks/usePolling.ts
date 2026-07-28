import { useFocusEffect } from "expo-router";
import { useCallback } from "react";

/**
 * Recharge `callback` immédiatement puis toutes les `intervalMs` tant que
 * l'écran est au premier plan et que `enabled` est vrai — approximation
 * front d'un flux "temps réel" en l'absence de WebSocket/SSE côté backend.
 */
export function usePolling(callback: () => void, intervalMs: number, enabled: boolean = true) {
  useFocusEffect(
    useCallback(() => {
      if (!enabled) return;
      callback();
      const interval = setInterval(callback, intervalMs);
      return () => clearInterval(interval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [callback, intervalMs, enabled])
  );
}
