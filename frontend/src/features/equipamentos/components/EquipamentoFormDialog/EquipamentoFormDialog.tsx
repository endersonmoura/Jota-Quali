import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Field } from "@/components/ui/Field/Field";
import { Modal } from "../Modal/Modal";
import { storage } from "@/lib/storage";
import {
  STATUS_LABEL,
  type Equipamento,
  type EquipamentoInput,
  type StatusEquipamento,
} from "../../types";
import styles from "./EquipamentoFormDialog.module.css";

interface Props {
  open: boolean;
  initial?: Equipamento | null;
  onClose: () => void;
  onSubmit: (input: EquipamentoInput) => void | Promise<void>;
}

const EMPTY: EquipamentoInput = {
  tag: "",
  nome: "",
  ultimaCalibracao: null,
  localizacao: "",
  status: "ativo",
};

type Errors = Partial<Record<keyof EquipamentoInput, string>>;

export function EquipamentoFormDialog({ open, initial, onClose, onSubmit }: Props) {
  const isEdit = !!initial;
  const [form, setForm] = useState<EquipamentoInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [padroes, setPadroes] = useState<{ id: string; nome: string; codigo: string }[]>([]);

  useEffect(() => {
    if (!open) return;
    setPadroes(storage.get<{ id: string; nome: string; codigo: string }[]>("jq:padroes:v1") || []);
    setErrors({});
    setForm(
      initial
        ? {
            tag: initial.tag,
            nome: initial.nome,
            ultimaCalibracao: initial.ultimaCalibracao,
            localizacao: initial.localizacao,
            status: initial.status,
            padrao: initial.padrao || "",
          }
        : { ...EMPTY, padrao: "" }
    );
  }, [open, initial]);

  function validate(input: EquipamentoInput): Errors {
    const e: Errors = {};
    if (!input.tag.trim()) e.tag = "Informe a tag do equipamento.";
    else if (input.tag.trim().length > 30) e.tag = "Máximo de 30 caracteres.";
    if (!input.nome.trim()) e.nome = "Informe o nome do equipamento.";
    else if (input.nome.trim().length > 120) e.nome = "Máximo de 120 caracteres.";
    if (input.ultimaCalibracao) {
      const d = new Date(input.ultimaCalibracao);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      if (Number.isNaN(d.getTime())) e.ultimaCalibracao = "Data inválida.";
      else if (d > today) e.ultimaCalibracao = "Não pode ser uma data futura.";
    }
    if (input.localizacao.length > 80) e.localizacao = "Máximo de 80 caracteres.";
    if (!input.padrao?.trim()) e.padrao = "Selecione um padrão.";
    return e;
  }

  async function handleSubmit(ev: FormEvent) {
    ev.preventDefault();
    const eMap = validate(form);
    setErrors(eMap);
    if (Object.keys(eMap).length > 0) return;
    setSubmitting(true);
    try {
      await onSubmit(form);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      open={open}
      onClose={submitting ? () => {} : onClose}
      title={isEdit ? "Editar equipamento" : "Novo equipamento"}
      description={
        isEdit
          ? "Atualize as informações do equipamento selecionado."
          : "Preencha os dados para cadastrar um novo equipamento."
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            type="submit"
            form="equipamento-form"
            loading={submitting}
          >
            {isEdit ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </>
      }
    >
      <form id="equipamento-form" onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.grid}>
          <Field
            label="Tag"
            required
            placeholder="Ex.: EQ-001"
            value={form.tag}
            onChange={(e) => setForm({ ...form, tag: e.target.value })}
            error={errors.tag}
            autoFocus
          />
          <div className={styles.selectField}>
            <label className={styles.selectLabel} htmlFor="eq-status">
              Status<span className={styles.required}>*</span>
            </label>
            <select
              id="eq-status"
              className={styles.select}
              value={form.status}
              onChange={(e) =>
                setForm({ ...form, status: e.target.value as StatusEquipamento })
              }
            >
              <option value="ativo">{STATUS_LABEL.ativo}</option>
              <option value="vencido">{STATUS_LABEL.vencido}</option>
              <option value="inativo">{STATUS_LABEL.inativo}</option>
            </select>
          </div>
        </div>

        <Field
          label="Nome do equipamento"
          required
          placeholder="Ex.: Balança analítica Shimadzu AY220"
          value={form.nome}
          onChange={(e) => setForm({ ...form, nome: e.target.value })}
          error={errors.nome}
        />

        <div className={styles.grid}>
          <Field
            label="Última calibração"
            type="date"
            value={form.ultimaCalibracao ?? ""}
            onChange={(e) =>
              setForm({ ...form, ultimaCalibracao: e.target.value || null })
            }
            error={errors.ultimaCalibracao}
            hint="Opcional"
          />
          <Field
            label="Localização"
            placeholder="Ex.: Laboratório 1"
            value={form.localizacao}
            onChange={(e) => setForm({ ...form, localizacao: e.target.value })}
            error={errors.localizacao}
            hint="Opcional"
          />
          <div className={styles.selectField}>
            <label className={styles.selectLabel} htmlFor="eq-padrao">
              Padrão<span className={styles.required}>*</span>
            </label>
            <select
              id="eq-padrao"
              className={styles.select}
              value={form.padrao || ""}
              onChange={(e) => setForm({ ...form, padrao: e.target.value })}
              required
            >
              <option value="" disabled>Selecione um padrão</option>
              {padroes.map(p => (
                <option key={p.id} value={p.nome}>{p.codigo} - {p.nome}</option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}
