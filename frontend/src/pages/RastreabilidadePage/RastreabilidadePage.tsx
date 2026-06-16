import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { Activity } from "lucide-react";
import { useRastreabilidade } from "@/features/rastreabilidade/hooks/useRastreabilidade";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import styles from "./RastreabilidadePage.module.css";

export default function RastreabilidadePage() {
  useDocumentTitle("Rastreabilidade");
  const { logs, loading } = useRastreabilidade();

  const hasLogs = logs.length > 0;

  return (
    <>
      <PageHeader
        eyebrow="Administração"
        title="Rastreabilidade"
        subtitle="Histórico de alterações realizadas em equipamentos, laudos, usuários e no sistema."
      />

      <div className={styles.section}>
        {loading ? (
          <div className={styles.loadingState}>Carregando histórico...</div>
        ) : !hasLogs ? (
          <EmptyState
            icon={Activity}
            title="Nenhum registro encontrado"
            description="Não há atividades registradas no histórico até o momento."
          />
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Data/Hora</th>
                  <th>Usuário</th>
                  <th>Ação</th>
                  <th>Entidade</th>
                  <th>Detalhes</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id}>
                    <td className={styles.dateCell}>
                      {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm:ss", { locale: ptBR })}
                    </td>
                    <td>{log.userName}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[`badge_${log.action.toLowerCase()}`]}`}>
                        {log.action}
                      </span>
                    </td>
                    <td>
                      <strong>{log.resource}</strong> ({log.resourceId})
                    </td>
                    <td className={styles.detailsCell}>{log.details}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
