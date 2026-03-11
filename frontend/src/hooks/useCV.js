import { useState, useEffect, useCallback } from "react";

export function useCV() {
  const [cv, setCV] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCV = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/cv");
      if (!res.ok) throw new Error("Erro ao carregar CV fonte.");
      setCV(await res.json());
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchCV(); }, [fetchCV]);

  return { cv, loading, error, refresh: fetchCV };
}

