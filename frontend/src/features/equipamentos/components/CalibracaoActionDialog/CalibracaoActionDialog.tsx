import { useState, useMemo } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { Field } from "@/components/ui/Field/Field";
import { FlaskConical, Map } from "lucide-react";
import type { Equipamento } from "../../types";
import { useQuery } from "@tanstack/react-query";
import { padroesService } from "@/features/padroes/services/padroesService";
import styles from "./CalibracaoActionDialog.module.css";

interface Props {
  open: boolean;
  equipamento: Equipamento | null;
  onSelectOption: (
    option: "laboratorio" | "campo",
    cpf: string,
    padraoId: number,
    validade: string,
    padraoText?: string
  ) => void;
  onClose: () => void;
}

export function CalibracaoActionDialog({ open, equipamento, onSelectOption, onClose }: Props) {
  const [cpf, setCpf] = useState("");
  const [padraoId, setPadraoId] = useState<number | "">("");
  const [validade, setValidade] = useState("");
  const [error, setError] = useState("");

  const { data: allPadroes = [], isLoading: loadingPadroes } = useQuery({
    queryKey: ["padroes"],
    queryFn: () => padroesService.list(),
  });

  const padroes = useMemo(() => allPadroes.filter((p) => p.status !== "inativo"), [allPadroes]);

  if (!equipamento) return null;

  const handleSelect = (option: "laboratorio" | "campo") => {
    if (!cpf.trim() || cpf.replace(/\D/g, '').length !== 11) {
      setError("Por favor, insira um CPF válido (11 dígitos).");
      return;
    }
    if (padraoId === "") {
      setError("Por favor, selecione um padrão de referência.");
      return;
    }
    if (!validade) {
      setError("Por favor, informe a nova data de validade da calibração.");
      return;
    }

    setError("");
    const padraoSelecionado = padroes.find(p => p.id === Number(padraoId));
    const padraoText = padraoSelecionado ? `${padraoSelecionado.codigo} - ${padraoSelecionado.descricao}` : undefined;
    onSelectOption(option, cpf, Number(padraoId), validade, padraoText);
  };

  const handleClose = () => {
    setCpf("");
    setPadraoId("");
    setValidade("");
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Opções de Calibração"
      description={`Selecione o tipo de calibração para o equipamento ${equipamento.codigo} - ${equipamento.descricao}.`}
    >
      <div style={{ marginBottom: "1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
        <Field
          label="Seu CPF"
          required
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => {
            setCpf(e.target.value);
            if (error) setError("");
          }}
          error={error.includes("CPF") ? error : undefined}
        />
        
        <div className="field-group">
          <label className="field-label">Padrão de Referência Utilizado <span style={{color: 'var(--jq-danger)'}}>*</span></label>
          <select 
            className="field-input" 
            value={padraoId} 
            onChange={(e) => {
              setPadraoId(e.target.value ? Number(e.target.value) : "");
              if (error) setError("");
            }}
            disabled={loadingPadroes}
          >
            <option value="">Selecione um padrão...</option>
            {padroes.map(p => (
              <option key={p.id} value={p.id}>{p.codigo} - {p.descricao}</option>
            ))}
          </select>
          {error.includes("padrão") && <span style={{color: 'var(--jq-danger)', fontSize: '0.875rem', marginTop: '0.25rem', display: 'block'}}>{error}</span>}
        </div>

        <Field
          label="Nova Validade"
          type="date"
          required
          value={validade}
          onChange={(e) => {
            setValidade(e.target.value);
            if (error) setError("");
          }}
          error={error.includes("validade") ? error : undefined}
        />
      </div>

      <div className={styles.options}>
        <button
          className={styles.optionCard}
          onClick={() => handleSelect("laboratorio")}
        >
          <FlaskConical size={32} className={styles.icon} />
          <div className={styles.textContainer}>
            <span className={styles.title}>Em Laboratório</span>
            <span className={styles.desc}>
              Calibração realizada em laboratório de testes.
            </span>
          </div>
        </button>

        <button
          className={styles.optionCard}
          onClick={() => handleSelect("campo")}
        >
          <Map size={32} className={styles.icon} />
          <div className={styles.textContainer}>
            <span className={styles.title}>Em Campo</span>
            <span className={styles.desc}>
              Calibração realizada no local de operação.
            </span>
          </div>
        </button>
      </div>

      <div className={styles.footer}>
        <Button variant="ghost" onClick={handleClose} fullWidth>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
