import { useState, useCallback } from "react";
import { Gauge, Wrench, CalendarClock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEquipamentos } from "@/features/equipamentos/hooks/useEquipamentos";
import { EquipamentosToolbar } from "@/features/equipamentos/components/EquipamentosToolbar/EquipamentosToolbar";
import { EquipamentosTable } from "@/features/equipamentos/components/EquipamentosTable/EquipamentosTable";
import { Pagination } from "@/features/equipamentos/components/Pagination/Pagination";
import { EquipamentoFormDialog } from "@/features/equipamentos/components/EquipamentoFormDialog/EquipamentoFormDialog";
import { ConfirmDialog } from "@/features/equipamentos/components/ConfirmDialog/ConfirmDialog";
import type { Equipamento, EquipamentoInput } from "@/features/equipamentos/types";
import { CalibracaoActionDialog } from "@/features/equipamentos/components/CalibracaoActionDialog/CalibracaoActionDialog";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { calibracaoService } from "@/features/calibracoes/services/calibracaoService";
import jsPDF from "jspdf";
import styles from "../EquipamentosPage/EquipamentosPage.module.css";

export default function CalibracaoPage() {
  useDocumentTitle("Calibração");
  const { user } = useAuth();

  const filterFn = useCallback((eq: Equipamento) => {
    return eq.status !== "inativo";
  }, []);

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
    update,
    remove,
    isLoading,
  } = useEquipamentos(filterFn);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Equipamento | null>(null);
  const [toDelete, setToDelete] = useState<Equipamento | null>(null);
  const [toCalibrate, setToCalibrate] = useState<Equipamento | null>(null);

  const hasAnyItems = items.length > 0;
  const hasFilteredResults = total > 0;
  const isFiltering = search.trim().length > 0 || statusFilter !== "todos";

  function openEdit(eq: Equipamento) {
    setEditing(eq);
    setFormOpen(true);
  }

  async function handleSubmit(input: EquipamentoInput) {
    try {
      if (editing) {
        update(editing.id, input);
        toast.success("Equipamento atualizado com sucesso.");
      }
      setFormOpen(false);
      setEditing(null);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar equipamento.";
      toast.error(msg);
    }
  }

  function handleConfirmDelete() {
    if (!toDelete) return;
    try {
      remove(toDelete.id);
      toast.success(`Equipamento ${toDelete.codigo} removido.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao remover equipamento.";
      toast.error(msg);
    } finally {
      setToDelete(null);
    }
  }

  async function handleSelectCalibrationOption(
    option: "laboratorio" | "campo", 
    cpf: string,
    padraoId: number,
    validade: string,
    padraoText?: string
  ) {
    if (!toCalibrate) return;
    try {
      // 1. Chama a API do backend
      await calibracaoService.registrarInterna({
        equipamentoId: toCalibrate.id,
        equipamentoReferenciaId: padraoId,
        dataCalibracao: new Date().toISOString(),
        validade: new Date(`${validade}T00:00:00`).toISOString(),
        cpfResponsavel: cpf.replace(/\D/g, ''),
        tipoLocal: option,
      });

      // 2. Geração do PDF Fake para demonstração no front (mantida a pedido)
      const doc = new jsPDF();
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Termo de Início de Calibração", 105, 20, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      const nomeUsuario = user ? user.name : "Usuário Desconhecido";
      
      const texto = `Eu, ${nomeUsuario}, portador(a) do CPF ${cpf}, estou iniciando a calibração do equipamento ${toCalibrate.codigo} - ${toCalibrate.descricao}, no dia ${dataAtual}. Padrão de Referência utilizado: ${padraoText || padraoId}.`;
      
      const linhasTexto = doc.splitTextToSize(texto, 170);
      doc.text(linhasTexto, 20, 40);

      doc.setFont("helvetica", "italic");
      doc.text("Documento gerado automaticamente pelo sistema Jota-Quali.", 105, 280, { align: "center" });

      doc.save(`Termo_Calibracao_${toCalibrate.codigo}.pdf`);

      toast.success(`Calibração registrada com sucesso! Equipamento atualizado.`);
      
      // Atualiza o estado local para sumir da lista ou mostrar o status correto
      update(toCalibrate.id, {
        ...toCalibrate,
        status: "ativo",
        dataUltimaCalibracao: new Date().toISOString()
      } as any);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao registrar a calibração.");
    } finally {
      setToCalibrate(null);
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Calibração"
        subtitle="Gerencie equipamentos em manutenção, inativos ou próximos do vencimento da calibração."
      />

      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gap: "0.5rem" }}>
          <Loader2 className="animate-spin" size={24} style={{ color: "var(--jq-primary)" }} />
          <span style={{ color: "var(--jq-text-light)" }}>Carregando calibrações pendentes...</span>
        </div>
      ) : !hasAnyItems && !isFiltering ? (
        <EmptyState
          icon={CalendarClock}
          title="Nenhum equipamento pendente"
          description="Atualmente não há equipamentos em manutenção, inativos ou próximos do vencimento da calibração."
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
                mode="calibracao"
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={toggleSort}
                onCalibrate={(eq) => setToCalibrate(eq)}
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
              icon={Gauge}
              title={
                isFiltering
                  ? "Nenhum resultado encontrado"
                  : "Nenhum equipamento pendente"
              }
              description={
                isFiltering
                  ? "Ajuste a busca ou os filtros para visualizar outros equipamentos."
                  : "Não há equipamentos precisando de calibração no momento."
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
            ? `Tem certeza que deseja excluir o equipamento "${toDelete.codigo} — ${toDelete.descricao}"? Essa ação não poderá ser desfeita.`
            : ""
        }
        confirmLabel="Excluir"
        onConfirm={handleConfirmDelete}
        onClose={() => setToDelete(null)}
      />

      <CalibracaoActionDialog
        open={!!toCalibrate}
        equipamento={toCalibrate}
        onSelectOption={handleSelectCalibrationOption}
        onClose={() => setToCalibrate(null)}
      />
    </>
  );
}
