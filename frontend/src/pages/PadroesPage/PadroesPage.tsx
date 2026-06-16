import { useState, useMemo } from "react";
import { Plus, Target, Trash2, Pencil, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { Button } from "@/components/ui/Button/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import styles from "./PadroesPage.module.css";
import { Modal } from "@/features/equipamentos/components/Modal/Modal";
import { Field } from "@/components/ui/Field/Field";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { padroesService } from "@/features/padroes/services/padroesService";
import type { Padrao, PadraoInput } from "@/features/padroes/types";

export default function PadroesPage() {
  useDocumentTitle("Padrões");
  const queryClient = useQueryClient();

  const { data: padroes = [], isLoading } = useQuery({
    queryKey: ["padroes"],
    queryFn: () => padroesService.list(),
  });

  const activePadroes = useMemo(() => padroes.filter((p) => p.status !== "inativo"), [padroes]);

  const createMutation = useMutation({
    mutationFn: (input: PadraoInput) => padroesService.create(input),
    onSuccess: () => {
      toast.success("Padrão cadastrado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["padroes"] });
      closeForm();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar padrão.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: Partial<PadraoInput> }) =>
      padroesService.update(id, input as PadraoInput),
    onSuccess: () => {
      toast.success("Padrão atualizado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["padroes"] });
      closeForm();
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Erro ao salvar padrão.");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => padroesService.inativar(id),
    onSuccess: () => {
      toast.success("Padrão inativado!");
      queryClient.invalidateQueries({ queryKey: ["padroes"] });
    },
    onError: () => {
      toast.error("Erro ao inativar padrão.");
    },
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<PadraoInput>({ descricao: "", codigo: "", tipo: "", status: "disponivel", situacaoDocumental: "regular" });

  function closeForm() {
    setFormOpen(false);
    setEditingId(null);
    setForm({ descricao: "", codigo: "", tipo: "", status: "disponivel", situacaoDocumental: "regular" });
  }

  function openCreate() {
    setEditingId(null);
    setForm({ descricao: "", codigo: "", tipo: "", status: "disponivel", situacaoDocumental: "regular" });
    setFormOpen(true);
  }

  function openEdit(p: Padrao) {
    setEditingId(p.id);
    setForm({ 
      descricao: p.descricao, 
      codigo: p.codigo, 
      tipo: p.tipo || "",
      status: p.status,
      situacaoDocumental: p.situacaoDocumental,
      validade: p.validade ? p.validade.split("T")[0] : "",
    });
    setFormOpen(true);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.descricao || !form.codigo) return;
    
    // Evita enviar string vazia para o backend, o que causaria erro de "Data Inválida"
    const payload = { ...form };
    if (!payload.validade || payload.validade.trim() === "") {
      delete payload.validade;
    }

    if (editingId) {
      // No update, não podemos enviar o código
      delete payload.codigo;
      updateMutation.mutate({ id: editingId, input: payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  function handleExcluir(id: number) {
    if (window.confirm("Deseja realmente inativar este padrão?")) {
      deleteMutation.mutate(id);
    }
  }

  const isPending = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Padrões"
        subtitle="Gerencie os padrões de referência utilizados nos equipamentos."
        actions={
          <Button
            variant="primary"
            leftIcon={<Plus size={16} />}
            onClick={openCreate}
          >
            Novo Padrão
          </Button>
        }
      />

      {isLoading ? (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gap: "0.5rem" }}>
          <Loader2 className="animate-spin" size={24} style={{ color: "var(--jq-primary)" }} />
          <span style={{ color: "var(--jq-text-light)" }}>Carregando padrões...</span>
        </div>
      ) : activePadroes.length === 0 ? (
        <EmptyState
          icon={Target}
          title="Nenhum padrão cadastrado"
          description="Você ainda não cadastrou nenhum padrão. Cadastre para vinculá-los aos equipamentos."
          actions={
            <Button
              variant="primary"
              leftIcon={<Plus size={16} />}
              onClick={openCreate}
            >
              Novo Padrão
            </Button>
          }
        />
      ) : (
        <div className={styles.wrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.sortableHeader}><div className={styles.headerContent}>Código</div></th>
                <th className={styles.sortableHeader}><div className={styles.headerContent}>Descrição</div></th>
                <th className={styles.sortableHeader}><div className={styles.headerContent}>Equipamentos Abrangidos</div></th>
                <th className={styles.actionsHead} aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {activePadroes.map((p) => (
                <tr key={p.id}>
                  <td className={styles.tag}>{p.codigo}</td>
                  <td className={styles.nome}>{p.descricao}</td>
                  <td>{p.tipo || "—"}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => openEdit(p)}
                        aria-label={`Editar ${p.codigo}`}
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        className={`${styles.iconBtn} ${styles.iconBtnDanger}`}
                        onClick={() => handleExcluir(p.id)}
                        aria-label={`Inativar ${p.codigo}`}
                        title="Inativar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={closeForm}
        title={editingId ? "Editar Padrão" : "Novo Padrão"}
        description={editingId ? "Atualize os dados do padrão selecionado." : "Preencha os dados do novo padrão."}
        footer={
          <>
            <Button variant="ghost" onClick={closeForm} disabled={isPending}>Cancelar</Button>
            <Button variant="primary" type="submit" form="padrao-form" disabled={isPending}>
              {isPending ? "Salvando..." : editingId ? "Salvar alterações" : "Cadastrar"}
            </Button>
          </>
        }
      >
        <form id="padrao-form" onSubmit={handleSubmit} className={styles.form}>
          <Field
            label="Código do Padrão"
            required
            placeholder="Ex.: PDR-001"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            autoFocus={!editingId}
            disabled={!!editingId}
            hint={editingId ? "O código do padrão não pode ser alterado após o cadastro." : undefined}
          />
          <Field
            label="Descrição do Padrão"
            required
            placeholder="Ex.: Peso Padrão 1kg"
            value={form.descricao}
            onChange={(e) => setForm({ ...form, descricao: e.target.value })}
            autoFocus={!!editingId}
          />
          <Field
            label="Equipamentos Abrangidos (Opcional)"
            placeholder="Ex.: Balanças até 5kg"
            value={form.tipo || ""}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            hint="Quais tipos de equipamentos este padrão afere."
          />
          <Field
            label="Validade (Opcional)"
            type="date"
            value={form.validade || ""}
            onChange={(e) => setForm({ ...form, validade: e.target.value })}
          />
        </form>
      </Modal>
    </>
  );
}
