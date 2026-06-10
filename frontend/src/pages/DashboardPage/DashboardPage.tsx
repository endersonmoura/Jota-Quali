import { Wrench, Gauge, FileText, AlertTriangle, ArrowUpRight } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { cn } from "@/lib/cn";
import styles from "./DashboardPage.module.css";

const KPIS = [
  { label: "Equipamentos ativos", value: "248", trend: "+12 este mês", icon: Wrench },
  { label: "Calibrações no prazo", value: "96%", trend: "+2,1% vs. mês anterior", icon: Gauge },
  { label: "Laudos emitidos (mês)", value: "182", trend: "+18 vs. mês anterior", icon: FileText },
  { label: "Pendências críticas", value: "7", trend: "-3 vs. semana anterior", icon: AlertTriangle, down: true },
];

const PENDENCIAS = [
  { titulo: "Balança de precisão · BAL-014", sub: "Calibração vence em 3 dias", tag: "Urgente", variant: "warn" as const },
  { titulo: "Paquímetro digital · PAQ-007", sub: "Calibração vencida há 2 dias", tag: "Crítico", variant: "" as const },
  { titulo: "Termômetro infravermelho · TER-022", sub: "Aguardando assinatura do laudo #4821", tag: "Assinatura", variant: "ok" as const },
  { titulo: "Esclerômetro · ESC-005", sub: "Laudo em revisão técnica", tag: "Em revisão", variant: "ok" as const },
];

const ATIVIDADES = [
  "Laudo #4820 emitido por Joana Andrade",
  "Calibração registrada para BAL-014",
  "Novo equipamento cadastrado: PAQ-031",
  "Assinatura digital concluída no laudo #4815",
];

export default function DashboardPage() {
  useDocumentTitle("Dashboard");
  const { user } = useAuth();
  const firstName = user?.name.split(" ")[0] ?? "";
  const greeting = user?.gender === "feminino" ? "Bem-vinda" : "Bem-vindo";

  return (
    <>
      <PageHeader
        eyebrow="Visão geral"
        title={`${greeting}${firstName ? `, ${firstName}` : ""}`}
        subtitle="Acompanhe os indicadores de qualidade e operação da JotaQuali em tempo real."
        actions={
          <>
            <Button variant="secondary">Exportar relatório</Button>
            <Button leftIcon={<ArrowUpRight size={16} />}>Novo laudo</Button>
          </>
        }
      />

      <div className={styles.grid}>
        {KPIS.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className={styles.kpi}>
              <div className={styles.kpiHead}>
                <span>{k.label}</span>
                <span className={styles.kpiIcon}><Icon size={16} /></span>
              </div>
              <div className={styles.kpiValue}>{k.value}</div>
              <div className={cn(styles.kpiTrend, k.down && styles.down)}>{k.trend}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.cols}>
        <section className={styles.panel}>
          <div>
            <div className={styles.panelTitle}>Pendências e prazos</div>
            <div className={styles.panelSubtitle}>Itens que requerem atenção da equipe técnica.</div>
          </div>
          <div className={styles.list}>
            {PENDENCIAS.map((p) => (
              <div key={p.titulo} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{p.titulo}</span>
                  <span className={styles.rowSub}>{p.sub}</span>
                </div>
                <span className={cn(styles.tag, p.variant && styles[p.variant])}>{p.tag}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.panel}>
          <div>
            <div className={styles.panelTitle}>Atividade recente</div>
            <div className={styles.panelSubtitle}>Últimos eventos do sistema.</div>
          </div>
          <div className={styles.list}>
            {ATIVIDADES.map((a) => (
              <div key={a} className={styles.row}>
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>{a}</span>
                  <span className={styles.rowSub}>há poucos minutos</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
