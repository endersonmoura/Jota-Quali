import { useCallback, useEffect, useMemo, useState } from "react";
import { equipamentosService } from "../services/equipamentosService";
import type {
  Equipamento,
  EquipamentoInput,
  StatusEquipamento,
} from "../types";

export type StatusFilter = "todos" | StatusEquipamento;
export type SortField = "tag" | "nome" | "ultimaCalibracao" | "localizacao" | "status" | null;
export type SortDirection = "asc" | "desc";

const PAGE_SIZE = 10;

export function useEquipamentos(baseFilter?: (eq: Equipamento) => boolean) {
  const [items, setItems] = useState<Equipamento[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    equipamentosService.list()
      .then((data) => {
        if (mounted) setItems(data);
      })
      .catch((err) => {
        console.error("Failed to fetch equipamentos", err);
      });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  const sorted = useMemo(() => {
    const list = [...items];
    if (!sortField) {
      return list.sort((a, b) =>
        a.tag.localeCompare(b.tag, undefined, { numeric: true, sensitivity: "base" })
      );
    }

    return list.sort((a, b) => {
      const valA = a[sortField] ?? "";
      const valB = b[sortField] ?? "";

      let comp = 0;
      if (typeof valA === "string" && typeof valB === "string") {
        comp = valA.localeCompare(valB, undefined, { numeric: true, sensitivity: "base" });
      } else {
        if (valA < valB) comp = -1;
        else if (valA > valB) comp = 1;
      }

      return sortDirection === "asc" ? comp : -comp;
    });
  }, [items, sortField, sortDirection]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((eq) => {
      if (baseFilter && !baseFilter(eq)) return false;
      if (statusFilter !== "todos" && eq.status !== statusFilter) return false;
      if (!term) return true;
      return (
        eq.tag.toLowerCase().includes(term) ||
        eq.nome.toLowerCase().includes(term) ||
        eq.localizacao.toLowerCase().includes(term)
      );
    });
  }, [sorted, search, statusFilter, baseFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const create = useCallback(async (input: EquipamentoInput) => {
    const novo = await equipamentosService.create(input);
    setItems((prev) => [novo, ...prev]);
    return novo;
  }, []);

  const update = useCallback(async (id: string, input: EquipamentoInput) => {
    const atualizado = await equipamentosService.update(id, input);
    setItems((prev) => prev.map((e) => (e.id === id ? atualizado : e)));
    return atualizado;
  }, []);

  const remove = useCallback(async (id: string) => {
    await equipamentosService.remove(id);
    setItems((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const toggleSort = useCallback((field: SortField) => {
    if (sortField === field) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else {
        setSortField(null);
        setSortDirection("asc");
      }
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  }, [sortField, sortDirection]);

  return {
    items,
    filtered,
    paginated,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortField,
    setSortField,
    sortDirection,
    setSortDirection,
    toggleSort,
    page: currentPage,
    setPage,
    totalPages,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    create,
    update,
    remove,
  };
}
