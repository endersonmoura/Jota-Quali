import { useState, FormEvent, useMemo, useRef } from "react";
import { FileText, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { Button } from "@/components/ui/Button/Button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEquipamentos } from "@/features/equipamentos/hooks/useEquipamentos";
import { Modal } from "@/features/equipamentos/components/Modal/Modal";
import { EquipamentosTable } from "@/features/equipamentos/components/EquipamentosTable/EquipamentosTable";
import { documentosService } from "@/features/laudos/services/documentosService";
import type { Equipamento } from "@/features/equipamentos/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./LaudosPage.module.css";

export default function LaudosPage() {
  useDocumentTitle("Laudos");
  const navigate = useNavigate();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { items: equipamentos } = useEquipamentos();

  const { data: documentos = [], isLoading: loadingDocs } = useQuery({
    queryKey: ["documentos"],
    queryFn: () => documentosService.list(),
  });

  const [formOpen, setFormOpen] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState<string>("");
  const [laboratorio, setLaboratorio] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => documentosService.uploadLaudo(formData),
    onSuccess: () => {
      toast.success("Laudo gerado e enviado com sucesso. Aguardando assinatura.");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
      setFormOpen(false);
      setSelectedEqId("");
      setLaboratorio("");
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao enviar laudo.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => documentosService.delete(id),
    onSuccess: () => {
      toast.success("Laudo removido com sucesso.");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
      setDeleteConfirmOpen(false);
      setDocToDelete(null);
    },
    onError: () => {
      toast.error("Erro ao remover o laudo.");
    },
  });

  // Equipamentos in calibration (not active)
  const equipamentosDisponiveis = useMemo(() => {
    return equipamentos.filter((eq) => eq.status !== "ativo");
  }, [equipamentos]);

  // Convert Documento objects to the format EquipamentosTable expects
  const laudosList = useMemo(() => {
    return documentos.map(doc => {
      return {
        id: doc.id,
        codigo: doc.equipamento ? doc.equipamento.codigo : "N/A",
        descricao: doc.equipamento ? doc.equipamento.descricao : "N/A",
        tipo: doc.equipamento ? doc.equipamento.tipo : doc.tipoDocumental,
        obraId: doc.equipamento ? doc.equipamento.obraId : undefined,
        dataUltimaCalibracao: doc.dataEmissao,
        status: doc.status as any,
        situacaoDocumental: doc.status,
        criadoEm: doc.criadoEm,
        pathArquivo: doc.pathArquivo,
      } as Equipamento & { pathArquivo?: string };
    });
  }, [documentos]);

  async function handleGerarLaudo(ev: FormEvent) {
    ev.preventDefault();
    if (!selectedEqId) {
      toast.error("Selecione um equipamento.");
      return;
    }
    
    if (!laboratorio.trim()) {
      toast.error("Informe o laboratório responsável pelo laudo.");
      return;
    }

    const file = fileInputRef.current?.files?.[0];
    if (!file) {
      toast.error("Selecione o arquivo PDF do laudo.");
      return;
    }

    const formData = new FormData();
    formData.append("equipamentoId", selectedEqId);
    formData.append("arquivo", file);
    formData.append("laboratorio", laboratorio);
    formData.append("dataEmissao", new Date().toISOString());
    
    const validade = new Date();
    validade.setFullYear(validade.getFullYear() + 1);
    formData.append("dataValidade", validade.toISOString());

    uploadMutation.mutate(formData);
  }

  function handleAssinarLaudo(eq: Equipamento) {
    navigate(`/assinatura-digital?docId=${eq.id}`);
  }

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<Equipamento | null>(null);

  function handleRemoverLaudo(eq: Equipamento) {
    setDocToDelete(eq);
    setDeleteConfirmOpen(true);
  }

  function confirmRemoverLaudo() {
    if (!docToDelete) return;
    deleteMutation.mutate(docToDelete.id as number);
  }

  return (
    <>
      <PageHeader
        eyebrow="Qualidade"
        title="Laudos laboratoriais"
        subtitle="Emissão, revisão e consulta de laudos técnicos do laboratório."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={() => setFormOpen(true)}
          >
            Novo Laudo
          </Button>
        }
      />

      {laudosList.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="Nenhum laudo gerado"
          description="Você ainda não lançou nenhum laudo. Gere um laudo para um equipamento em calibração."
          actions={
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={() => setFormOpen(true)}
            >
              Novo Laudo
            </Button>
          }
        />
      ) : (
        <div className={styles.section}>
          {loadingDocs ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gap: "0.5rem" }}>
              <Loader2 className="animate-spin" size={24} style={{ color: "var(--jq-primary)" }} />
              <span style={{ color: "var(--jq-text-light)" }}>Carregando documentos...</span>
            </div>
          ) : (
            <EquipamentosTable
              items={laudosList}
              onEdit={() => {}}
              onDelete={handleRemoverLaudo}
              mode="laudos"
              onSign={user?.role === "Administrador" ? handleAssinarLaudo : undefined}
            />
          )}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedEqId("");
          setLaboratorio("");
        }}
        title="Novo Laudo"
        description="Selecione um equipamento em calibração para atrelar o novo laudo e faça o upload do documento."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setFormOpen(false);
                setSelectedEqId("");
                setLaboratorio("");
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="gerar-laudo-form"
              disabled={equipamentosDisponiveis.length === 0 || uploadMutation.isPending}
            >
              {uploadMutation.isPending ? "Enviando..." : "Fazer Upload"}
            </Button>
          </>
        }
      >
        <form id="gerar-laudo-form" onSubmit={handleGerarLaudo} className={styles.form}>
          <div className={styles.selectField} style={{ marginTop: "1rem" }}>
            <label className={styles.selectLabel} htmlFor="eq-select">
              Equipamento em Calibração<span className={styles.required}>*</span>
            </label>
            {equipamentosDisponiveis.length > 0 ? (
              <select
                id="eq-select"
                className={styles.select}
                value={selectedEqId}
                onChange={(e) => setSelectedEqId(e.target.value)}
                required
              >
                <option value="" disabled>Selecione um equipamento</option>
                {equipamentosDisponiveis.map((eq) => (
                  <option key={eq.id} value={eq.id}>{eq.codigo} - {eq.descricao}</option>
                ))}
              </select>
            ) : (
              <p style={{ color: "var(--jq-text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>Não há equipamentos em calibração no momento.</p>
            )}
          </div>
          
          <div className={styles.selectField} style={{ marginTop: "1rem" }}>
            <label className={styles.selectLabel} htmlFor="laboratorio-input">
              Laboratório<span className={styles.required}>*</span>
            </label>
            <input
              type="text"
              id="laboratorio-input"
              className={styles.select}
              placeholder="Ex: Laboratório JotaQuali"
              value={laboratorio}
              onChange={(e) => setLaboratorio(e.target.value)}
              required
            />
          </div>

          <div className={styles.selectField} style={{ marginTop: "1rem" }}>
            <label className={styles.selectLabel} htmlFor="laudo-file">
              Documento do Laudo (PDF)<span className={styles.required}>*</span>
            </label>
            <input
              type="file"
              id="laudo-file"
              accept="application/pdf"
              className={styles.select}
              ref={fileInputRef}
              required
            />
          </div>
        </form>
      </Modal>

      <Modal
        open={deleteConfirmOpen}
        onClose={() => {
          setDeleteConfirmOpen(false);
          setDocToDelete(null);
        }}
        title="Excluir Laudo"
        description="Tem certeza que deseja excluir este laudo?"
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDocToDelete(null);
              }}
              disabled={deleteMutation.isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="danger"
              onClick={confirmRemoverLaudo}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Excluindo..." : "Excluir"}
            </Button>
          </>
        }
      >
        <p style={{ marginTop: "1rem", color: "var(--jq-text-muted)" }}>
          O laudo selecionado será permanentemente removido do sistema. Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </>
  );
}
