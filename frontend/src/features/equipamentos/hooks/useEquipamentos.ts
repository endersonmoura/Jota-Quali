import { useCallback, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { equipamentosService } from "../services/equipamentosService";
import type {
  Equipamento,
  EquipamentoInput,
  StatusEquipamento,
} from "../types";

export type StatusFilter = "todos" | StatusEquipamento;
export type SortField = "codigo" | "descricao" | "dataUltimaCalibracao" | "status" | null;
export type SortDirection = "asc" | "desc";

const PAGE_SIZE = 10;

export function useEquipamentos(baseFilter?: (eq: Equipamento) => boolean) {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("todos");
  const [sortField, setSortField] = useState<SortField>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [page, setPage] = useState(1);

  const { data: allItems = [], isLoading, isFetching } = useQuery({
    queryKey: ["equipamentos"],
    queryFn: () => equipamentosService.list(),
  });

  const sorted = useMemo(() => {
    const list = [...allItems];
    if (!sortField) {
      return list.sort((a, b) =>
        a.codigo.localeCompare(b.codigo, undefined, { numeric: true, sensitivity: "base" })
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
  }, [allItems, sortField, sortDirection]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sorted.filter((eq) => {
      if (baseFilter && !baseFilter(eq)) return false;
      if (statusFilter !== "todos" && eq.status !== statusFilter) return false;
      if (!term) return true;
      return (
        eq.codigo.toLowerCase().includes(term) ||
        eq.descricao.toLowerCase().includes(term)
      );
    });
  }, [sorted, search, statusFilter, baseFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  // Quando mudamos a busca ou filtro, a página atual pode ficar inválida
  const currentPage = Math.min(page, totalPages);
  
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPage]);

  const createMutation = useMutation({
    mutationFn: (input: EquipamentoInput) => equipamentosService.create(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipamentos"] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: string | number; input: EquipamentoInput }) =>
      equipamentosService.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipamentos"] });
    },
  });

  const inativarMutation = useMutation({
    mutationFn: (id: string | number) => equipamentosService.inativar(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["equipamentos"] });
    },
  });

  const create = useCallback(
    async (input: EquipamentoInput) => {
      return createMutation.mutateAsync(input);
    },
    [createMutation]
  );

  const update = useCallback(
    async (id: string | number, input: EquipamentoInput) => {
      return updateMutation.mutateAsync({ id, input });
    },
    [updateMutation]
  );

  const remove = useCallback(
    async (id: string | number) => {
      return inativarMutation.mutateAsync(id);
    },
    [inativarMutation]
  );

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

  // Função auxiliar para resetar a paginação ao digitar (substituindo o antigo useEffect)
  const handleSetSearch = useCallback((val: string) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleSetStatusFilter = useCallback((val: StatusFilter) => {
    setStatusFilter(val);
    setPage(1);
  }, []);

  return {
    items: allItems,
    filtered,
    paginated,
    search,
    setSearch: handleSetSearch,
    statusFilter,
    setStatusFilter: handleSetStatusFilter,
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
    isLoading,
    isFetching,
  };
}
