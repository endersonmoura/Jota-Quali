import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Edit2, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Card, CardBody } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";

import { obraService, ObraDTO } from "@/services/obra/obra.service";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { ObraFormDialog } from "./ObraFormDialog";
import styles from "./ObrasPage.module.css";

export default function ObrasPage() {
  useDocumentTitle("Gestão de Obras");
  
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [obraToEdit, setObraToEdit] = useState<ObraDTO | null>(null);

  const { data: obras, isLoading, refetch } = useQuery({
    queryKey: ["obras", "all"],
    queryFn: () => obraService.list(),
  });

  const handleOpenCreate = () => {
    setObraToEdit(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (obra: ObraDTO) => {
    setObraToEdit(obra);
    setIsDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    setIsDialogOpen(false);
    refetch();
  };

  return (
    <div className={styles.container}>
      <PageHeader
        eyebrow="Cadastros"
        title="Gestão de Obras"
        subtitle="Gerencie os canteiros e localizações cadastradas."
        actions={
          <Button onClick={handleOpenCreate} leftIcon={<Plus size={16} />}>
            Nova Obra
          </Button>
        }
      />

      <Card className={styles.tableCard}>
        <CardBody>
          {isLoading ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "4rem", gap: "0.5rem" }}>
              <Loader2 className="animate-spin" size={24} style={{ color: "var(--jq-primary)" }} />
              <span style={{ color: "var(--jq-text-light)" }}>Carregando obras...</span>
            </div>
          ) : obras?.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Nenhuma obra cadastrada no sistema.</p>
            </div>
          ) : (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nome da Obra</th>
                    <th>Localização</th>
                    <th>Status</th>
                    <th style={{ textAlign: "right" }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {obras?.map((obra) => (
                    <tr key={obra.id}>
                      <td>{obra.nomeObra}</td>
                      <td>{obra.localizacao || "-"}</td>
                      <td>
                        <span className={obra.status === "ativa" ? styles.statusAtiva : styles.statusInativa}>
                          {obra.status === "ativa" ? "Ativa" : "Inativa"}
                        </span>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <div className={styles.actions}>
                          <Button
                            variant="secondary"
                            size="sm"
                            leftIcon={<Edit2 size={14} />}
                            onClick={() => handleOpenEdit(obra)}
                          >
                            Editar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardBody>
      </Card>

      {isDialogOpen && (
        <ObraFormDialog
          open={isDialogOpen}
          obra={obraToEdit}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleDialogSuccess}
        />
      )}
    </div>
  );
}
