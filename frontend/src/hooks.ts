import { useEffect, useState } from "react";

export function useFetch<T>(loader: () => Promise<T>, refreshMs?: number) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const run = () =>
      loader()
        .then((d) => {
          if (active) {
            setData(d);
            setError(null);
          }
        })
        .catch((e: Error) => active && setError(e.message));
    run();
    const id = refreshMs ? window.setInterval(run, refreshMs) : undefined;
    return () => {
      active = false;
      if (id) window.clearInterval(id);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, error };
}
