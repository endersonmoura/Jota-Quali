import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../Sidebar/Sidebar";
import { Header } from "../Header/Header";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { storage } from "@/lib/storage";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Clock } from "lucide-react";
import styles from "./AppShell.module.css";

const COLLAPSED_KEY = "jq.sidebar.collapsed";

export function AppShell() {
  const { user } = useAuth();
  const isMobile = useMediaQuery("(max-width: 960px)");
  const firstName = user?.name.split(" ")[0] ?? "";
  const greeting = user?.gender === "feminino" ? "Bem-vinda" : "Bem-vindo";
  const [collapsed, setCollapsed] = useState<boolean>(
    () => storage.get<boolean>(COLLAPSED_KEY) ?? false
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    storage.set(COLLAPSED_KEY, collapsed);
  }, [collapsed]);

  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

  const toggleSidebar = () => {
    if (isMobile) setMobileOpen((v) => !v);
    else setCollapsed((v) => !v);
  };

  return (
    <div className={styles.shell}>
      <a href="#main-content" className="jq-skip-link">
        Pular para o conteúdo
      </a>

      {user?.role !== "aguardando_aprovacao" && (
        <Sidebar
          collapsed={collapsed}
          mobileOpen={mobileOpen}
          onToggleCollapsed={() => setCollapsed((v) => !v)}
          onCloseMobile={() => setMobileOpen(false)}
        />
      )}

      {isMobile && mobileOpen && user?.role !== "aguardando_aprovacao" && (
        <div
          className={styles.overlay}
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}

      <div className={styles.main}>
        <Header onToggleSidebar={toggleSidebar} hideMenuBtn={user?.role === "aguardando_aprovacao"} />
        <main id="main-content" className={styles.content}>
          {user?.role === "aguardando_aprovacao" ? (
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <PageHeader
                eyebrow="Acesso Restrito"
                title={`${greeting}${firstName ? `, ${firstName}` : ""}`}
                subtitle="Sua conta está em fase de avaliação."
              />
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <EmptyState
                  icon={Clock}
                  title="Aguardando Aprovação"
                  description="Sua conta foi criada com sucesso, mas um Administrador precisa definir sua função para liberar o acesso às funcionalidades do sistema."
                />
              </div>
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  );
}
