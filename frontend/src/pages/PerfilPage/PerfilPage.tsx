import React, { useState } from "react";
import { UserRound, Lock, Save, Camera } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card/Card";
import { Field } from "@/components/ui/Field/Field";
import { Button } from "@/components/ui/Button/Button";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import styles from "./PerfilPage.module.css";

const ROLE_LABELS: Record<string, string> = {
  admin: "Administrador",
  consulta: "Consulta",
  calibrador: "Calibrador",
  operacional: "Operacional",
};

export default function PerfilPage() {
  useDocumentTitle("Meu Perfil");
  const { user, updateUser } = useAuth();

  const [name, setName] = useState(user?.name ?? "");
  const [email, setEmail] = useState(user?.email ?? "");
  const [cpf, setCpf] = useState(user?.cpf ?? "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      toast.loading("Salvando perfil...", { id: "save-profile" });
      const { api } = await import("@/services/api");
      const res = await api.patch(`/usuarios/${user.id}/profile`, {
        name,
        email,
        cpf,
      });
      if (res.data.success) {
        // Obter auth context methods? I need to use the `useAuth` hook.
        // I will do it here.
        updateUser({ name, email, cpf });
        toast.success("Perfil atualizado com sucesso.", { id: "save-profile" });
      }
    } catch (error) {
      toast.error("Erro ao atualizar perfil.", { id: "save-profile" });
    }
  };

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("As novas senhas não coincidem.");
      return;
    }
    // Implementação mockada
    toast.success("Senha alterada com sucesso.");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <>
      <PageHeader
        eyebrow="Conta"
        title="Meu Perfil"
        subtitle="Gerencie suas informações pessoais e configurações de segurança."
      />

      <div className={styles.section}>
        <Card padded className={styles.card}>
          <CardHeader title="Informações Pessoais" />
          <CardBody>
            <div className={styles.avatarSection}>
              <div className={styles.avatar}>
                {user?.name
                  ? user.name
                      .split(" ")
                      .slice(0, 2)
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                  : "JQ"}
              </div>
              <div className={styles.avatarInfo}>
                <div className={styles.avatarDetails}>
                  <span className={styles.avatarName}>{user?.name ?? "Usuário"}</span>
                  <span className={styles.avatarRole}>{user?.role ? ROLE_LABELS[user.role] : "Consulta"}</span>
                </div>
              </div>
            </div>
          </CardBody>
          <CardBody>
            <form onSubmit={handleSaveProfile} className={styles.formGrid}>
              <div className={styles.formRow}>
                <Field
                  label="Nome completo"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Field
                  label="E-mail"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <Field
                  label="CPF"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
                <Field
                  label="Função/Cargo"
                  value={user?.role ? ROLE_LABELS[user.role] : ""}
                  disabled
                  hint="A função não pode ser alterada diretamente pelo usuário."
                />
              </div>

              <div className={styles.actions}>
                <Button type="submit" variant="primary" leftIcon={<Save size={16} />}>
                  Salvar informações
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card padded className={styles.card}>
          <CardHeader title="Segurança" subtitle="Atualize sua senha de acesso." />
          <CardBody>
            <form onSubmit={handleSavePassword} className={styles.formGrid}>
              <Field
                label="Senha atual"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
              <div className={styles.formRow}>
                <Field
                  label="Nova senha"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <Field
                  label="Confirmar nova senha"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <div className={styles.actions}>
                <Button type="submit" variant="primary" leftIcon={<Lock size={16} />}>
                  Atualizar senha
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
