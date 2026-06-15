import { useState } from "react";
import { Modal } from "../Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { Field } from "@/components/ui/Field/Field";
import { FlaskConical, Map } from "lucide-react";
import type { Equipamento } from "../../../types";
import styles from "./CalibracaoActionDialog.module.css";

interface Props {
  open: boolean;
  equipamento: Equipamento | null;
  onSelectOption: (option: "laboratorio" | "campo", cpf: string) => void;
  onClose: () => void;
}

export function CalibracaoActionDialog({ open, equipamento, onSelectOption, onClose }: Props) {
  const [cpf, setCpf] = useState("");
  const [error, setError] = useState("");

  if (!equipamento) return null;

  const handleSelect = (option: "laboratorio" | "campo") => {
    if (!cpf.trim() || cpf.replace(/\D/g, '').length !== 11) {
      setError("Por favor, insira um CPF válido (11 dígitos).");
      return;
    }
    setError("");
    onSelectOption(option, cpf);
  };

  const handleClose = () => {
    setCpf("");
    setError("");
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Opções de Calibração"
      description={`Selecione o tipo de calibração para o equipamento ${equipamento.tag} - ${equipamento.nome}.`}
    >
      <div style={{ marginBottom: "1.5rem" }}>
        <Field
          label="Seu CPF"
          required
          placeholder="000.000.000-00"
          value={cpf}
          onChange={(e) => {
            setCpf(e.target.value);
            if (error) setError("");
          }}
          error={error}
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
