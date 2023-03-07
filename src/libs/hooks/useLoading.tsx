import { useCallback, useMemo, useState } from 'react';

export function useLoading(): [
  boolean,
  <T>(promise: Promise<T>) => Promise<T>,
  React.Dispatch<React.SetStateAction<boolean>>,
] {
  const [loading, setLoading] = useState(false);
  const startTransition = useCallback(async <T,>(promise: Promise<T>) => {
    try {
      setLoading(true);
      const data = await promise;
      return data;
    } finally {
      setLoading(false);
    }
  }, []);
  return useMemo(
    () => [loading, startTransition, setLoading],
    [loading, startTransition, setLoading],
  );
}
