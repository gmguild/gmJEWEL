import { useCallback, useEffect, useState } from "react";

export type LoadingOrErroredValue<T = any> = ({forceRefresh: () => void}) & ({ loading: true, value: null, error: null }
| (
    {loading: false, value: T, error: null}
  | {loading: false, value: null, error: Error}
))

export function useAsyncValue<T = any>(
  factory: () => Promise<T>,
  dependencies: ReadonlyArray<any> = []
): LoadingOrErroredValue<T> {
    const [value, setValue] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    const forceRefresh = useCallback(() => {
      setLoading(true);
      factory()
        .then(result => setValue(result))
        .catch(error => setError(error))
        .finally(() => setLoading(false));
    }, dependencies);

    useEffect(() => forceRefresh(), dependencies)

    // Just to meet return type strictness
    if(loading) {
        return { forceRefresh, loading: true, error: null, value: null };
    }

    if(error) {
        return { forceRefresh, loading: false, error, value: null }
    }

    return { forceRefresh, loading: false, value: value!, error: null }
}
