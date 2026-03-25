import { useState, useCallback, useRef } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T, Args extends unknown[]> extends UseApiState<T> {
  execute: (...args: Args) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic hook that wraps any async function with loading/error/data state.
 *
 * @example
 * const { data, loading, error, execute } = useApi(authService.getSessions);
 * // In a component:
 * useEffect(() => { execute(); }, [execute]);
 */
export function useApi<T, Args extends unknown[] = []>(
  fn: (...args: Args) => Promise<T>,
  options?: { onSuccess?: (data: T) => void; onError?: (err: string) => void }
): UseApiReturn<T, Args> {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  // Prevent setting state after unmount
  const mounted = useRef(true);
  const setStateIfMounted = useCallback((s: Partial<UseApiState<T>>) => {
    if (mounted.current) setState((prev) => ({ ...prev, ...s }));
  }, []);

  const execute = useCallback(
    async (...args: Args): Promise<T | null> => {
      setStateIfMounted({ loading: true, error: null });
      try {
        const result = await fn(...args);
        setStateIfMounted({ data: result, loading: false });
        options?.onSuccess?.(result);
        return result;
      } catch (err: unknown) {
        const message =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          (err instanceof Error ? err.message : 'An unexpected error occurred');
        setStateIfMounted({ error: message, loading: false });
        options?.onError?.(message);
        return null;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fn]
  );

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null });
  }, []);

  return { ...state, execute, reset };
}

export default useApi;
