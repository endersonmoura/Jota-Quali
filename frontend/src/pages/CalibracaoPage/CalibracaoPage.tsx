import { useState, useCallback } from "react";
import { Gauge, Wrench, CalendarClock } from "lucide-react";
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
import jsPDF from "jspdf";
import styles from "../EquipamentosPage/EquipamentosPage.module.css";

export default function CalibracaoPage() {
  useDocumentTitle("Calibração");
  const { user } = useAuth();

  const filterFn = useCallback((eq: Equipamento) => {
    return eq.status !== "ativo";
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
      toast.success(`Equipamento ${toDelete.tag} removido.`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao remover equipamento.";
      toast.error(msg);
    } finally {
      setToDelete(null);
    }
  }

  function handleSelectCalibrationOption(option: "laboratorio" | "campo", cpf: string) {
    if (!toCalibrate) return;
    const tipo = option === "laboratorio" ? "laboratório" : "campo";
    try {
      update(toCalibrate.id, {
        nome: toCalibrate.nome,
        tag: toCalibrate.tag,
        status: "calibracao",
        localizacao: toCalibrate.localizacao,
        ultimaCalibracao: toCalibrate.ultimaCalibracao,
        padrao: toCalibrate.padrao,
        laudoAssinado: toCalibrate.laudoAssinado,
        tipoCalibracao: option,
      });

      // Geração do PDF
      const doc = new jsPDF();
      const dataAtual = new Date().toLocaleDateString("pt-BR");
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.text("Termo de Início de Calibração", 105, 20, { align: "center" });

      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      
      const nomeUsuario = user ? user.name : "Usuário Desconhecido";
      
      const texto = `Eu, ${nomeUsuario}, portador(a) do CPF ${cpf}, estou iniciando a calibração do equipamento ${toCalibrate.tag} - ${toCalibrate.nome}, no dia ${dataAtual}.`;
      
      const linhasTexto = doc.splitTextToSize(texto, 170);
      doc.text(linhasTexto, 20, 40);

      doc.setFont("helvetica", "italic");
      doc.text("Documento gerado automaticamente pelo sistema Jota-Quali.", 105, 280, { align: "center" });

      doc.save(`Termo_Calibracao_${toCalibrate.tag}.pdf`);

      toast.success(`Iniciando calibração em ${tipo} para ${toCalibrate.tag}...`);
    } catch (err) {
      toast.error("Erro ao registrar a calibração.");
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

      {!hasAnyItems && !isFiltering ? (
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
            ? `Tem certeza que deseja excluir o equipamento "${toDelete.tag} — ${toDelete.nome}"? Essa ação não poderá ser desfeita.`
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
