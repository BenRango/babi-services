import { useCallback, useEffect, useState } from "react";

interface AsyncState<T> {
  loading: boolean;
  error: Error | null;
  data: T | null;
}

/**
 * Wrap an async service call (shaped like a real API call) into a
 * loading/error/data state, so screens are already written the way
 * they'll behave once a real backend is plugged into src/services/*.
 */
export function useAsync<T>(fn: () => Promise<T>, deps: unknown[] = []) {
  const [state, setState] = useState<AsyncState<T>>({
    loading: true,
    error: null,
    data: null,
  });

  const run = useCallback(() => {
    let cancelled = false;
    setState((s) => ({ ...s, loading: true, error: null }));
    fn()
      .then((data) => {
        if (!cancelled) setState({ loading: false, error: null, data });
      })
      .catch((error: Error) => {
        if (!cancelled) setState({ loading: false, error, data: null });
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  useEffect(() => run(), [run]);

  return { ...state, reload: run };
}
