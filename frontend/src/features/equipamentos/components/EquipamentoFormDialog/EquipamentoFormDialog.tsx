import { useEffect, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button/Button";
import { Field } from "@/components/ui/Field/Field";
import { Modal } from "../Modal/Modal";
import {
  STATUS_LABEL,
  type Equipamento,
  type EquipamentoInput,
  type StatusEquipamento,
} from "../../types";
import { obraService, type ObraDTO } from "@/services/obra/obra.service";
import styles from "./EquipamentoFormDialog.module.css";

interface Props {
  open: boolean;
  initial?: Equipamento | null;
  onClose: () => void;
  onSubmit: (input: EquipamentoInput) => void | Promise<void>;
}

const EMPTY: EquipamentoInput = {
  codigo: "",
  descricao: "",
  tipo: "",
  dataUltimaCalibracao: null,
  dataVencimentoCalibracao: null,
  obraId: undefined,
  situacaoDocumental: "regular",
  status: "ativo",
};

type Errors = Partial<Record<keyof EquipamentoInput, string>>;

export function EquipamentoFormDialog({ open, initial, onClose, onSubmit }: Props) {
  const isEdit = !!initial;
  const [form, setForm] = useState<EquipamentoInput>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [obras, setObras] = useState<ObraDTO[]>([]);

  useEffect(() => {
    let mounted = true;
    obraService.list("ativa").then((data) => {
      if (mounted) setObras(data);
    }).catch(console.error);
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    if (!open) return;
    setErrors({});
    setForm(
      initial
        ? {
            codigo: initial.codigo,
            descricao: initial.descricao,
            tipo: initial.tipo || "",
            dataUltimaCalibracao: initial.dataUltimaCalibracao,
            dataVencimentoCalibracao: initial.dataVencimentoCalibracao,
            obraId: initial.obraId,
            status: initial.status,
            situacaoDocumental: initial.situacaoDocumental || "regular",
          }
        : { ...EMPTY }
    );
  }, [open, initial]);

  function validate(input: EquipamentoInput): Errors {
    const e: Errors = {};
    if (!input.codigo?.trim()) e.codigo = "Informe o código do equipamento.";
    if (!input.descricao?.trim()) e.descricao = "Informe a descrição.";
    if (!input.tipo?.trim()) e.tipo = "Informe o tipo do equipamento.";

    if (input.dataUltimaCalibracao) {
      const d = new Date(input.dataUltimaCalibracao);
      if (Number.isNaN(d.getTime())) e.dataUltimaCalibracao = "Data inválida.";
    }
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
            label="Código / Tag"
            required
            placeholder="Ex.: EQ-001"
            value={form.codigo}
            onChange={(e) => setForm({ ...form, codigo: e.target.value })}
            error={errors.codigo}
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
          label="Descrição do equipamento"
          required
          placeholder="Ex.: Balança analítica Shimadzu AY220"
          value={form.descricao}
          onChange={(e) => setForm({ ...form, descricao: e.target.value })}
          error={errors.descricao}
        />

        <div className={styles.grid}>
          <Field
            label="Tipo *"
            required
            placeholder="Ex.: Balança"
            value={form.tipo}
            onChange={(e) => setForm({ ...form, tipo: e.target.value })}
            error={errors.tipo}
          />
          <div className={styles.selectField}>
            <label className={styles.selectLabel} htmlFor="eq-sit-doc">
              Situação Documental
            </label>
            <select
              id="eq-sit-doc"
              className={styles.select}
              value={form.situacaoDocumental}
              onChange={(e) =>
                setForm({ ...form, situacaoDocumental: e.target.value })
              }
            >
              <option value="regular">Regular</option>
              <option value="irregular">Irregular</option>
              <option value="aguardando_assinatura">Aguardando Assinatura</option>
            </select>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.selectField} style={{ gridColumn: "span 2" }}>
            <label className={styles.selectLabel} htmlFor="eq-obra">
              Obra
            </label>
            <select
              id="eq-obra"
              className={styles.select}
              value={form.obraId || ""}
              onChange={(e) =>
                setForm({ ...form, obraId: e.target.value ? Number(e.target.value) : undefined })
              }
            >
              <option value="">Selecione uma obra (opcional)</option>
              {obras.map((obra) => (
                <option key={obra.id} value={obra.id}>
                  {obra.nomeObra}
                </option>
              ))}
            </select>
            <span style={{ fontSize: "0.75rem", color: "var(--jq-text-muted)", marginTop: "0.25rem" }}>
              Opcional. Vincule este equipamento a uma obra específica.
            </span>
          </div>
        </div>

        <div className={styles.grid}>
          <Field
            label="Última calibração"
            type="date"
            value={form.dataUltimaCalibracao ?? ""}
            onChange={(e) =>
              setForm({ ...form, dataUltimaCalibracao: e.target.value || null })
            }
            error={errors.dataUltimaCalibracao}
            hint="Opcional"
          />
          <Field
            label="Vencimento calibração"
            type="date"
            value={form.dataVencimentoCalibracao ?? ""}
            onChange={(e) =>
              setForm({ ...form, dataVencimentoCalibracao: e.target.value || null })
            }
            error={errors.dataVencimentoCalibracao}
            hint="Opcional"
          />
        </div>
      </form>
    </Modal>
  );
}
