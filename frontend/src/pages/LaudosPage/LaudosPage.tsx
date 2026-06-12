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
import { storage } from "@/lib/storage";
import styles from "./LaudosPage.module.css";

interface Padrao {
  id: string;
  nome: string;
  codigo: string;
  equipamentos: string;
  statusLaudo?: "aguardando_assinatura" | "assinado";
  laudoAssinado?: boolean;
}

const PADROES_KEY = "jq:padroes:v1";

export default function LaudosPage() {
  useDocumentTitle("Laudos");
  const navigate = useNavigate();
  const { user } = useAuth();

  const { items, update } = useEquipamentos();

  const [formOpen, setFormOpen] = useState(false);
  const [tipoLaudo, setTipoLaudo] = useState<"equipamento" | "padrao">("equipamento");
  const [selectedEqId, setSelectedEqId] = useState<string>("");

  const [padroes, setPadroes] = useState<Padrao[]>(() => {
    return storage.get<Padrao[]>(PADROES_KEY) || [];
  });

  function savePadroes(newPadroes: Padrao[]) {
    storage.set(PADROES_KEY, newPadroes);
    setPadroes(newPadroes);
  }

  // Equipamentos in calibration (not active and no laudo pending/signed recently)
  // For simplicity, any equipment not 'ativo' can have a laudo generated.
  const equipamentosDisponiveis = useMemo(() => {
    return items.filter(
      (eq) => eq.status !== "ativo" && eq.statusLaudo !== "aguardando_assinatura"
    );
  }, [items]);

  // Laudos generated (equipments with statusLaudo set)
  const laudos = useMemo(() => {
    const eqs = items.filter((eq) => eq.statusLaudo !== undefined);
    const pds = padroes.filter((p) => p.statusLaudo !== undefined).map(p => ({
      id: `padrao_${p.id}`,
      tag: p.codigo,
      nome: p.nome,
      ultimaCalibracao: null,
      localizacao: "—",
      status: "ativo" as const,
      statusLaudo: p.statusLaudo,
      createdAt: new Date().toISOString(),
      padrao: "Padrão",
    }));
    return [...eqs, ...pds as any];
  }, [items, padroes]);

  function handleGerarLaudo(ev: FormEvent) {
    ev.preventDefault();
    if (!selectedEqId) {
      toast.error(`Selecione um ${tipoLaudo === "equipamento" ? "equipamento" : "padrão"}.`);
      return;
    }

    if (tipoLaudo === "equipamento") {
      const eq = items.find((e) => e.id === selectedEqId);
      if (!eq) return;

      try {
        update(eq.id, {
          ...eq,
          statusLaudo: "aguardando_assinatura",
        });
        toast.success(`Laudo gerado para o equipamento ${eq.tag}. Aguardando assinatura.`);
      } catch (err) {
        toast.error("Erro ao gerar laudo.");
      }
    } else {
      const p = padroes.find((p) => p.id === selectedEqId);
      if (!p) return;

      const novos = padroes.map(pad => pad.id === selectedEqId ? {
        ...pad,
        statusLaudo: "aguardando_assinatura" as const
      } : pad);
      savePadroes(novos);
      toast.success(`Laudo gerado para o padrão ${p.codigo}. Aguardando assinatura.`);
    }

    setFormOpen(false);
    setSelectedEqId("");
  }

  function handleAssinarLaudo(eq: Equipamento) {
    navigate(`/assinatura-digital?eqId=${eq.id}`);
  }

  function handleRemoverLaudo(eq: Equipamento) {
    const isPadrao = eq.id.startsWith("padrao_");
    if (window.confirm(`Deseja remover o ${isPadrao ? "padrão" : "equipamento"} ${eq.tag} dos laudos?`)) {
      if (isPadrao) {
        const realId = eq.id.replace("padrao_", "");
        const novos = padroes.map(pad => pad.id === realId ? {
          ...pad,
          statusLaudo: undefined,
          laudoAssinado: false,
        } : pad);
        savePadroes(novos);
        toast.success(`Padrão ${eq.tag} removido dos laudos.`);
      } else {
        try {
          update(eq.id, {
            ...eq,
            statusLaudo: undefined,
          });
          toast.success(`Equipamento ${eq.tag} removido dos laudos.`);
        } catch (err) {
          toast.error("Erro ao remover equipamento.");
        }
      }
    }
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
              Novo Laudo
            </Button>
          }
        />
      ) : (
        <div className={styles.section}>
          <EquipamentosTable
            items={laudos}
            onEdit={() => {}} // No edit needed here
            onDelete={handleRemoverLaudo} // Allows removing the item from laudos
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
        title="Novo Laudo"
        description={tipoLaudo === "equipamento" 
          ? "Selecione um equipamento em calibração para atrelar o novo laudo e faça o upload do documento."
          : "Selecione um padrão para atrelar o novo laudo e faça o upload do documento."}
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
            <label className={styles.selectLabel}>Tipo</label>
            <div style={{ display: "flex", gap: "1rem", marginTop: "0.25rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                <input 
                  type="radio" 
                  name="tipoLaudo" 
                  checked={tipoLaudo === "equipamento"} 
                  onChange={() => {
                    setTipoLaudo("equipamento");
                    setSelectedEqId("");
                  }} 
                />
                Equipamento
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.875rem" }}>
                <input 
                  type="radio" 
                  name="tipoLaudo" 
                  checked={tipoLaudo === "padrao"} 
                  onChange={() => {
                    setTipoLaudo("padrao");
                    setSelectedEqId("");
                  }} 
                />
                Padrão
              </label>
            </div>
          </div>

          <div className={styles.selectField} style={{ marginTop: "1rem" }}>
            <label className={styles.selectLabel} htmlFor="eq-select">
              {tipoLaudo === "equipamento" ? "Equipamento em Calibração" : "Padrões"}<span className={styles.required}>*</span>
            </label>
            {tipoLaudo === "equipamento" ? (
              equipamentosDisponiveis.length > 0 ? (
                <select
                  id="eq-select"
                  className={styles.select}
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione um equipamento</option>
                  {equipamentosDisponiveis.map((eq) => (
                    <option key={eq.id} value={eq.id}>{eq.tag} - {eq.nome}</option>
                  ))}
                </select>
              ) : (
                <p style={{ color: "var(--jq-text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>Não há equipamentos em calibração no momento.</p>
              )
            ) : (
              padroes.length > 0 ? (
                <select
                  id="eq-select"
                  className={styles.select}
                  value={selectedEqId}
                  onChange={(e) => setSelectedEqId(e.target.value)}
                  required
                >
                  <option value="" disabled>Selecione um padrão</option>
                  {padroes.filter(p => p.statusLaudo !== "aguardando_assinatura").map((p) => (
                    <option key={p.id} value={p.id}>{p.codigo} - {p.nome}</option>
                  ))}
                </select>
              ) : (
                <p style={{ color: "var(--jq-text-muted)", fontSize: "0.875rem", marginTop: "0.5rem" }}>Não há padrões cadastrados.</p>
              )
            )}
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
              required
            />
          </div>
        </form>
      </Modal>
    </>
  );
}
