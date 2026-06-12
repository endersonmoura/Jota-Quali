import { useEffect, useRef, useState } from "react";
import { Bell, LogOut, Menu, Search, Settings, UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLE_LABELS } from "@/features/auth/types";
import { ROUTES } from "@/config/routes";
import styles from "./Header.module.css";

export interface HeaderProps {
  onToggleSidebar: () => void;
  hideMenuBtn?: boolean;
}

export function Header({ onToggleSidebar, hideMenuBtn }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e: MouseEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [menuOpen]);

  const onLogout = async () => {
    await logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <header className={styles.header}>
      {hideMenuBtn ? (
        <div style={{ width: "32px", height: "32px", visibility: "hidden" }} />
      ) : (
        <button
          type="button"
          className={styles.iconBtn}
          onClick={onToggleSidebar}
          aria-label="Alternar menu"
        >
          <Menu size={18} />
        </button>
      )}

      <div className={styles.search}>
        <Search size={16} className={styles.searchIcon} />
        <input
          type="search"
          placeholder="Buscar equipamentos, laudos, calibrações..."
          aria-label="Buscar no sistema"
        />
      </div>

      <div className={styles.spacer} />

      <div className={styles.right} ref={menuRef}>
        <button
          type="button"
          className={styles.iconBtn}
          aria-label="Notificações"
        >
          <Bell size={18} />
        </button>

        <button
          type="button"
          className={styles.userBtn}
          onClick={() => setMenuOpen((v) => !v)}
          aria-haspopup="menu"
          aria-expanded={menuOpen}
        >
          <span className={styles.avatar} aria-hidden>
            {user?.avatarInitials ?? "JQ"}
          </span>
          <span className={styles.userMeta}>
            <span className={styles.userName}>{user?.name ?? "Usuário"}</span>
            <span className={styles.userRole}>{user?.role ? ROLE_LABELS[user.role] : ""}</span>
          </span>
        </button>

        {menuOpen && (
          <div className={styles.menu} role="menu">
            <div className={styles.menuHeader}>
              <div className={styles.menuName}>{user?.name}</div>
              <div className={styles.menuEmail}>{user?.email}</div>
            </div>
            <button
              className={styles.menuItem}
              role="menuitem"
              type="button"
              onClick={() => navigate(ROUTES.perfil)}
            >
              <UserRound size={15} /> Meu perfil
            </button>
            <button
              className={styles.menuItem}
              role="menuitem"
              type="button"
              onClick={() => navigate(ROUTES.configuracoes)}
            >
              <Settings size={15} /> Configurações
            </button>
            <button
              className={`${styles.menuItem} ${styles.danger}`}
              role="menuitem"
              type="button"
              onClick={onLogout}
            >
              <LogOut size={15} /> Sair
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
