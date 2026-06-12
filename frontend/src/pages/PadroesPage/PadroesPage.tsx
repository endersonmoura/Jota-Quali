import { useState } from "react";
import { Plus, Target, Trash2, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { Button } from "@/components/ui/Button/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { storage } from "@/lib/storage";
import styles from "./PadroesPage.module.css";
import { Modal } from "@/features/equipamentos/components/Modal/Modal";
import { Field } from "@/components/ui/Field/Field";

interface Padrao {
  id: string;
  nome: string;
  codigo: string;
  equipamentos: string;
}

const PADROES_KEY = "jq:padroes:v1";

export default function PadroesPage() {
  useDocumentTitle("Padrões");

  const [padroes, setPadroes] = useState<Padrao[]>(() => {
    const data = storage.get<Padrao[]>(PADROES_KEY);
    return data || [];
  });

  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nome: "", codigo: "", equipamentos: "" });

  function openCreate() {
    setEditingId(null);
    setForm({ nome: "", codigo: "", equipamentos: "" });
    setFormOpen(true);
  }

  function openEdit(p: Padrao) {
    setEditingId(p.id);
    setForm({ nome: p.nome, codigo: p.codigo, equipamentos: p.equipamentos || "" });
    setFormOpen(true);
  }

  function savePadroes(newPadroes: Padrao[]) {
    storage.set(PADROES_KEY, newPadroes);
    setPadroes(newPadroes);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nome || !form.codigo) return;
    
    if (editingId) {
      const novos = padroes.map(p => p.id === editingId ? {
        ...p,
        nome: form.nome,
        codigo: form.codigo,
        equipamentos: form.equipamentos,
      } : p);
      savePadroes(novos);
      toast.success("Padrão atualizado com sucesso!");
    } else {
      const novoPadrao = {
        id: Math.random().toString(36).substr(2, 9),
        nome: form.nome,
        codigo: form.codigo,
        equipamentos: form.equipamentos,
      };
      savePadroes([...padroes, novoPadrao]);
      toast.success("Padrão cadastrado com sucesso!");
    }
    
    setFormOpen(false);
    setEditingId(null);
    setForm({ nome: "", codigo: "", equipamentos: "" });
  }

  function handleExcluir(id: string) {
    if (window.confirm("Deseja realmente excluir este padrão?")) {
      savePadroes(padroes.filter(p => p.id !== id));
      toast.success("Padrão excluído!");
    }
  }

  return (
    <>
      <PageHeader
        eyebrow="Operação"
        title="Padrões"
        subtitle="Gerencie os padrões utilizados nos equipamentos."
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

      {padroes.length === 0 ? (
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
                <th className={styles.sortableHeader}><div className={styles.headerContent}>Nome</div></th>
                <th className={styles.sortableHeader}><div className={styles.headerContent}>Equipamentos abrangidos</div></th>
                <th className={styles.actionsHead} aria-label="Ações"></th>
              </tr>
            </thead>
            <tbody>
              {padroes.map((p) => (
                <tr key={p.id}>
                  <td className={styles.tag}>{p.codigo}</td>
                  <td className={styles.nome}>{p.nome}</td>
                  <td>{p.equipamentos || "—"}</td>
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
                        aria-label={`Excluir ${p.codigo}`}
                        title="Excluir"
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
        onClose={() => setFormOpen(false)}
        title={editingId ? "Editar Padrão" : "Novo Padrão"}
        description={editingId ? "Atualize os dados do padrão selecionado." : "Preencha os dados do novo padrão."}
        footer={
          <>
            <Button variant="ghost" onClick={() => setFormOpen(false)}>Cancelar</Button>
            <Button variant="primary" type="submit" form="padrao-form">
              {editingId ? "Salvar alterações" : "Cadastrar"}
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
            autoFocus
          />
          <Field
            label="Nome do Padrão"
            required
            placeholder="Ex.: Peso Padrão 1kg"
            value={form.nome}
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <Field
            label="Equipamentos Abrangidos"
            placeholder="Ex.: Trena e régua"
            value={form.equipamentos}
            onChange={(e) => setForm({ ...form, equipamentos: e.target.value })}
          />
        </form>
      </Modal>
    </>
  );
}
