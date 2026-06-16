import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Modal } from "@/features/equipamentos/components/Modal/Modal";
import { Field } from "@/components/ui/Field/Field";
import { Button } from "@/components/ui/Button/Button";
import { obraService, ObraDTO, CreateObraDTO, UpdateObraDTO } from "@/services/obra/obra.service";
import styles from "./ObraFormDialog.module.css";

interface ObraFormDialogProps {
  open: boolean;
  obra: ObraDTO | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function ObraFormDialog({ open, obra, onClose, onSuccess }: ObraFormDialogProps) {
  const isEditing = !!obra;
  
  const [nomeObra, setNomeObra] = useState(obra?.nomeObra || "");
  const [localizacao, setLocalizacao] = useState(obra?.localizacao || "");
  const [status, setStatus] = useState(obra?.status || "ativa");

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      if (isEditing) {
        const data: UpdateObraDTO = { nomeObra, localizacao, status };
        return obraService.update(obra.id, data);
      } else {
        const data: CreateObraDTO = { nomeObra, localizacao };
        return obraService.create(data);
      }
    },
    onSuccess: () => {
      toast.success(isEditing ? "Obra atualizada com sucesso!" : "Obra cadastrada com sucesso!");
      onSuccess();
    },
    onError: () => {
      toast.error("Ocorreu um erro ao salvar a obra.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeObra.trim()) return;
    mutate();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar Obra" : "Nova Obra"}
      description={isEditing ? "Altere as informações da obra." : "Cadastre um novo canteiro de obras."}
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleSubmit} variant="primary" loading={isPending}>
            {isEditing ? "Salvar alterações" : "Cadastrar"}
          </Button>
        </>
      }
    >
      <form id="obra-form" onSubmit={handleSubmit} className={styles.formGrid}>
        <div className={styles.formRow}>
          <Field
            label="Nome da Obra *"
            value={nomeObra}
            onChange={(e) => setNomeObra(e.target.value)}
            placeholder="Ex: Canteiro 1 - Zona Sul"
            required
          />
        </div>
        
        <div className={styles.formRow}>
          <Field
            label="Localização"
            value={localizacao}
            onChange={(e) => setLocalizacao(e.target.value)}
            placeholder="Endereço ou Cidade"
          />
        </div>

        {isEditing && (
          <div className={styles.formRow}>
            <div className={styles.selectField}>
              <label className={styles.selectLabel} htmlFor="obra-status">
                Status
              </label>
              <select
                id="obra-status"
                className={styles.select}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="ativa">Ativa</option>
                <option value="inativa">Inativa</option>
              </select>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
}
