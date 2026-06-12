import { Modal } from "../Modal/Modal";
import { Button } from "@/components/ui/Button/Button";
import { FlaskConical, Map } from "lucide-react";
import type { Equipamento } from "../../../types";
import styles from "./CalibracaoActionDialog.module.css";

interface Props {
  open: boolean;
  equipamento: Equipamento | null;
  onSelectOption: (option: "laboratorio" | "campo") => void;
  onClose: () => void;
}

export function CalibracaoActionDialog({ open, equipamento, onSelectOption, onClose }: Props) {
  if (!equipamento) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Opções de Calibração"
      description={`Selecione o tipo de calibração para o equipamento ${equipamento.tag} - ${equipamento.nome}.`}
    >
      <div className={styles.options}>
        <button
          className={styles.optionCard}
          onClick={() => onSelectOption("laboratorio")}
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
          onClick={() => onSelectOption("campo")}
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
        <Button variant="ghost" onClick={onClose} fullWidth>
          Cancelar
        </Button>
      </div>
    </Modal>
  );
}
