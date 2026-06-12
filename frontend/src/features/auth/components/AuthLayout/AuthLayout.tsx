import { ShieldCheck, Activity, FileSignature } from "lucide-react";
import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo/Logo";
import styles from "./AuthLayout.module.css";

export interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={styles.layout}>
      <aside className={styles.brand} aria-hidden>
        <div className={styles.brandTop}>
          <span className={styles.brandLogo}>
            <span className="mark">JQ</span>
            JotaQuali
          </span>
        </div>

        <div className={styles.brandMid}>
          <h2 className={styles.brandTitle}>
            Confiabilidade técnica para a <em>construção civil</em>.
          </h2>
          <p className={styles.brandLead}>
            Laudos laboratoriais e assinatura digital.
          </p>

          <ul className={styles.features}>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>
                <Activity size={14} />
              </span>
              Monitoramento em tempo real de calibrações e prazos
            </li>
            <li className={styles.feature}>
              <span className={styles.featureIcon}>
                <FileSignature size={14} />
              </span>
              Emissão e assinatura digital de laudos com validade legal
            </li>
          </ul>
        </div>

        <div className={styles.brandFoot}>
          © {new Date().getFullYear()} JotaQuali — Sistema de gestão da qualidade
        </div>
      </aside>

      <section className={styles.formSide}>
        <div className={styles.formInner}>
          <div className={styles.mobileLogo}>
            <Logo />
          </div>
          <header className={styles.heading}>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </header>
          {children}
          {footer && <div className={styles.footerLine}>{footer}</div>}
        </div>
      </section>
    </div>
  );
}

export { styles as authLayoutStyles };
