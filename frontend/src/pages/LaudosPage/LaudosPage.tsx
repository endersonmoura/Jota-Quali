import { useState, FormEvent, useMemo } from "react";
import { FileText, Plus, CheckCircle } from "lucide-react";
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
import type { Equipamento } from "@/features/equipamentos/types";
import styles from "./LaudosPage.module.css";

export default function LaudosPage() {
  useDocumentTitle("Laudos");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { items, update } = useEquipamentos();

  const [formOpen, setFormOpen] = useState(false);
  const [selectedEqId, setSelectedEqId] = useState<string>("");

  // Equipamentos in calibration (not active and no laudo pending/signed recently)
  // For simplicity, any equipment not 'ativo' can have a laudo generated.
  const equipamentosDisponiveis = useMemo(() => {
    return items.filter(
      (eq) => eq.status !== "ativo" && eq.statusLaudo !== "aguardando_assinatura"
    );
  }, [items]);

  // Laudos generated (equipments with statusLaudo set)
  const laudos = useMemo(() => {
    return items.filter((eq) => eq.statusLaudo !== undefined);
  }, [items]);

  function handleGerarLaudo(ev: FormEvent) {
    ev.preventDefault();
    if (!selectedEqId) {
      toast.error("Selecione um equipamento.");
      return;
    }

    const eq = items.find((e) => e.id === selectedEqId);
    if (!eq) return;

    try {
      update(eq.id, {
        ...eq,
        statusLaudo: "aguardando_assinatura",
      });
      toast.success(`Laudo gerado para o equipamento ${eq.tag}. Aguardando assinatura.`);
      setFormOpen(false);
      setSelectedEqId("");
    } catch (err) {
      toast.error("Erro ao gerar laudo.");
    }
  }

  function handleAssinarLaudo(eq: Equipamento) {
    navigate(`/assinatura-digital?eqId=${eq.id}`);
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
            Lançar Laudo
          </Button>
        }
      />

      {laudos.length === 0 ? (
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
              Lançar Laudo
            </Button>
          }
        />
      ) : (
        <div className={styles.section}>
          <EquipamentosTable
            items={laudos}
            onEdit={() => {}} // No edit needed here
            onDelete={() => {}} // No delete needed here
            mode="laudos"
            onSign={user?.role === "admin" ? handleAssinarLaudo : undefined}
          />
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => {
          setFormOpen(false);
          setSelectedEqId("");
        }}
        title="Lançar Laudo"
        description="Selecione um equipamento em calibração para atrelar o novo laudo."
        footer={
          <>
            <Button
              variant="ghost"
              onClick={() => {
                setFormOpen(false);
                setSelectedEqId("");
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              type="submit"
              form="gerar-laudo-form"
              disabled={equipamentosDisponiveis.length === 0}
            >
              Gerar Laudo
            </Button>
          </>
        }
      >
        <form id="gerar-laudo-form" onSubmit={handleGerarLaudo} className={styles.form}>
          <div className={styles.selectField}>
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
                <option value="" disabled>
                  Selecione um equipamento
                </option>
                {equipamentosDisponiveis.map((eq) => (
                  <option key={eq.id} value={eq.id}>
                    {eq.tag} - {eq.nome}
                  </option>
                ))}
              </select>
            ) : (
              <p style={{ color: "var(--jq-text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                Não há equipamentos em calibração no momento.
              </p>
            )}
          </div>
        </form>
      </Modal>
    </>
  );
}
