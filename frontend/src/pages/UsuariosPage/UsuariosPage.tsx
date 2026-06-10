import { useEffect, useState } from "react";
import { Users, Pencil } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { EmptyState } from "@/components/feedback/EmptyState/EmptyState";
import { Button } from "@/components/ui/Button/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { authService } from "@/features/auth/services/authService";
import type { AuthUser } from "@/features/auth/types";
import { Modal } from "@/features/equipamentos/components/Modal/Modal";
import styles from "./UsuariosPage.module.css";

const ROLE_LABELS = {
  admin: "Administrador",
  consulta: "Consulta",
  calibrador: "Calibrador",
  operacional: "Operacional",
};

export default function UsuariosPage() {
  useDocumentTitle("Usuários");
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [editingUser, setEditingUser] = useState<AuthUser | null>(null);
  const [selectedRole, setSelectedRole] = useState<AuthUser["role"]>("consulta");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setUsers(authService.listUsers());
  }, []);

  const handleEdit = (u: AuthUser) => {
    setEditingUser(u);
    setSelectedRole(u.role);
  };

  const handleSaveRole = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setLoading(true);
    try {
      await authService.updateUserRole(editingUser.id, selectedRole);
      setUsers(authService.listUsers());
      toast.success(`Cargo de ${editingUser.name} atualizado com sucesso.`);
      setEditingUser(null);
    } catch (err) {
      toast.error("Erro ao atualizar cargo do usuário.");
    } finally {
      setLoading(false);
    }
  };

  if (currentUser?.role !== "admin") {
    return (
      <>
        <PageHeader eyebrow="Administração" title="Usuários" />
        <div className={styles.section}>
          <EmptyState
            icon={Users}
            title="Acesso Negado"
            description="Apenas administradores podem gerenciar usuários."
          />
        </div>
      </>
    );
  }

  return (
    <>
      <PageHeader
        eyebrow="Administração"
        title="Usuários"
        subtitle="Gerencie os acessos e permissões da sua equipe."
      />

      <div className={styles.section}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Usuário</th>
                <th>E-mail</th>
                <th>Cargo Atual</th>
                <th style={{ textAlign: "right" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div className={styles.userInfo}>
                      <div className={styles.avatar}>{u.avatarInitials}</div>
                      <span className={styles.userName}>{u.name}</span>
                    </div>
                  </td>
                  <td className={styles.userEmail}>{u.email}</td>
                  <td>
                    <span className={styles.roleBadge}>{ROLE_LABELS[u.role]}</span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        type="button"
                        className={styles.iconBtn}
                        onClick={() => handleEdit(u)}
                        title="Alterar cargo"
                        disabled={u.id === currentUser.id} // Prevents admin from demoting themselves by accident here
                      >
                        <Pencil size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        open={!!editingUser}
        onClose={() => setEditingUser(null)}
        title="Alterar Cargo do Usuário"
        description={`Selecione o novo nível de permissão para ${editingUser?.name}.`}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditingUser(null)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit" form="role-form" loading={loading}>
              Salvar
            </Button>
          </>
        }
      >
        <form id="role-form" onSubmit={handleSaveRole} className={styles.form}>
          <div className={styles.selectField}>
            <label className={styles.selectLabel} htmlFor="user-role">
              Cargo
            </label>
            <select
              id="user-role"
              className={styles.select}
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as AuthUser["role"])}
            >
              <option value="admin">Administrador</option>
              <option value="calibrador">Calibrador</option>
              <option value="operacional">Operacional</option>
              <option value="consulta">Consulta</option>
            </select>
          </div>
        </form>
      </Modal>
    </>
  );
}
