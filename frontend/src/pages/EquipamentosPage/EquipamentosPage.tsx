import { useState } from "react";
import { Plus, Wrench, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { Button } from "@/components/ui/Button/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEquipamentos } from "@/features/equipamentos/hooks/useEquipamentos";
import { EquipamentosToolbar } from "@/features/equipamentos/components/EquipamentosToolbar/EquipamentosToolbar";
import { EquipamentosTable } from "@/features/equipamentos/components/EquipamentosTable/EquipamentosTable";
import { Pagination } from "@/features/equipamentos/components/Pagination/Pagination";
import { EquipamentoFormDialog } from "@/features/equipamentos/components/EquipamentoFormDialog/EquipamentoFormDialog";
import { ConfirmDialog } from "@/features/equipamentos/components/ConfirmDialog/ConfirmDialog";
import type {
  Equipamento,
  EquipamentoInput,
} from "@/features/equipamentos/types";
import styles from "./EquipamentosPage.module.css";

export default function EquipamentosPage() {
  useDocumentTitle("Equipamentos");

  const {
    items,
    paginated,
    total,
    page,
    totalPages,
    pageSize,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    sortField,
    sortDirection,
    toggleSort,
    create,
    update,
    remove,
    isLoading,
  } = useEquipamentos();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Equipamento | null>(null);
  const [toDelete, setToDelete] = useState<Equipamento | null>(null);

  const hasAnyItems = items.length > 0;
  const hasFilteredResults = total > 0;
  const isFiltering =
    search.trim().length > 0 || statusFilter !== "todos";

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(eq: Equipamento) {
    setEditing(eq);
    setFormOpen(true);
  }

  async function handleSubmit(input: EquipamentoInput) {
    try {
      if (editing) {
        await update(editing.id, input);
        toast.success("Equipamento atualizado com sucesso.");
      } else {
        await create(input);
        toast.success("Equipamento cadastrado com sucesso.");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erro ao salvar equipamento.";
      toast.error(msg);
    }
  }

  async function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      await remove(toDelete.id);
      toast.success(`Equipamento ${toDelete.codigo} inativado.`);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "Erro ao remover equipamento.";
      toast.error(msg);
    } finally {
      setToDelete(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Equipamentos"
        subtitle="Cadastro, identificação e controle do parque de equipamentos da empresa."
        actions={
          <Button variant="primary" leftIcon={<Plus size={16} />} onClick={openCreate}>
            Novo equipamento
          </Button>
        }
      />

      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gap: "0.5rem" }}>
          <Loader2 className="animate-spin" size={24} style={{ color: "var(--jq-primary)" }} />
          <span style={{ color: "var(--jq-text-light)" }}>Carregando equipamentos...</span>
        </div>
      ) : !hasAnyItems ? (
        <EmptyState
          icon={Wrench}
          title="Nenhum equipamento cadastrado"
          description="Cadastre o primeiro equipamento para começar a controlar tags, localizações e calibrações."
          actions={
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={openCreate}
            >
              Cadastrar equipamento
            </Button>
          }
        />
      ) : (
        <div className={styles.section}>
          <EquipamentosToolbar
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
          />

          {hasFilteredResults ? (
            <>
              <EquipamentosTable
                items={paginated}
                onEdit={openEdit}
                onDelete={(eq) => setToDelete(eq)}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={toggleSort}
              />
              <Pagination
                page={page}
                totalPages={totalPages}
                total={total}
                pageSize={pageSize}
                onChange={setPage}
              />
            </>
          ) : (
            <EmptyState
              icon={Wrench}
              title={
                isFiltering
                  ? "Nenhum resultado encontrado"
                  : "Nenhum equipamento cadastrado"
              }
              description={
                isFiltering
                  ? "Ajuste a busca ou os filtros para visualizar outros equipamentos."
                  : "Cadastre o primeiro equipamento para começar."
              }
            />
          )}
        </div>
      )}

      <EquipamentoFormDialog
        open={formOpen}
        initial={editing}
        onClose={() => {
          setFormOpen(false);
          setEditing(null);
        }}
        onSubmit={handleSubmit}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Excluir equipamento"
        message={
          toDelete
            ? `Tem certeza que deseja inativar o equipamento "${toDelete.codigo} — ${toDelete.descricao}"?`
            : ""
        }
        confirmLabel="Inativar"
        onConfirm={handleConfirmDelete}
        onClose={() => setToDelete(null)}
      />
    </>
  );
}
