import { useState, useEffect, useCallback } from "react";
import { auditService } from "../../../services/audit/audit.service";
import type { AuditResponseDTO } from "../../../services/audit/audit.types";

export function useRastreabilidade() {
  const [logs, setLogs] = useState<AuditResponseDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await auditService.list();
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
