import { useState, useEffect, useCallback } from "react";
import { rastreabilidadeService } from "../services/rastreabilidadeService";
import type { LogRastreabilidade } from "../types";

export function useRastreabilidade() {
  const [logs, setLogs] = useState<LogRastreabilidade[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await rastreabilidadeService.list();
      setLogs(data);
    } catch (err) {
      console.error("Erro ao carregar logs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return {
    logs,
    loading,
    refresh: fetchLogs,
  };
}

