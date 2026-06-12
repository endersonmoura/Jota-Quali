import { useEffect, useState } from "react";
import { Moon, Sun, Bell, Shield, Settings } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card/Card";
import { Button } from "@/components/ui/Button/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { storage } from "@/lib/storage";
import styles from "./ConfiguracoesPage.module.css";

const THEME_KEY = "jq.theme";

export default function ConfiguracoesPage() {
  useDocumentTitle("Configurações");

  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactor, setTwoFactor] = useState(false);

  useEffect(() => {
    // Carrega a preferência de tema ao montar
    const savedTheme = storage.get<string>(THEME_KEY);
    if (savedTheme === "dark") {
      setDarkMode(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !darkMode ? "dark" : "light";
    setDarkMode(!darkMode);
    storage.set(THEME_KEY, newTheme);
    
    // Aplica a classe de dark mode no HTML principal
    if (newTheme === "dark") {
      document.documentElement.classList.add("dark-theme");
    } else {
      document.documentElement.classList.remove("dark-theme");
    }

    toast.success(`Modo ${!darkMode ? "Escuro" : "Claro"} ativado!`);
  };

  const handleSaveNotifications = () => {
    toast.success("Preferências de notificação salvas.");
  };

  const handleSaveSecurity = () => {
    toast.success("Configurações de segurança atualizadas.");
  };

  return (
    <>
      <PageHeader
        eyebrow="Sistema"
        title="Configurações"
        subtitle="Personalize as preferências do sistema e do seu ambiente de trabalho."
      />

      <div className={styles.section}>
        <Card padded className={styles.card}>
          <CardHeader 
            title="Aparência" 
            subtitle="Gerencie como o JotaQuali é exibido no seu dispositivo." 
          />
          <CardBody>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}>
                  {darkMode ? <Moon size={20} /> : <Sun size={20} />}
                </div>
                <div>
                  <h3 className={styles.settingTitle}>Modo Escuro (Dark Mode)</h3>
                  <p className={styles.settingDesc}>
                    Altera o esquema de cores da aplicação para tons escuros, ideal para ambientes com pouca luz.
                  </p>
                </div>
              </div>
              <Button variant="secondary" onClick={toggleTheme}>
                {darkMode ? "Desativar Modo Escuro" : "Ativar Modo Escuro"}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card padded className={styles.card}>
          <CardHeader 
            title="Notificações" 
            subtitle="Escolha quais alertas você deseja receber." 
          />
          <CardBody>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}>
                  <Bell size={20} />
                </div>
                <div>
                  <h3 className={styles.settingTitle}>E-mails de Alerta</h3>
                  <p className={styles.settingDesc}>
                    Receba e-mails quando equipamentos estiverem com a calibração próxima do vencimento.
                  </p>
                </div>
              </div>
              <label className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={emailNotifications} 
                  onChange={(e) => setEmailNotifications(e.target.checked)} 
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.actions}>
              <Button variant="primary" onClick={handleSaveNotifications}>Salvar Preferências</Button>
            </div>
          </CardBody>
        </Card>

        <Card padded className={styles.card}>
          <CardHeader 
            title="Segurança" 
            subtitle="Aumente a proteção da sua conta." 
          />
          <CardBody>
            <div className={styles.settingRow}>
              <div className={styles.settingInfo}>
                <div className={styles.settingIcon}>
                  <Shield size={20} />
                </div>
                <div>
                  <h3 className={styles.settingTitle}>Autenticação em Dois Fatores (2FA)</h3>
                  <p className={styles.settingDesc}>
                    Exige um código extra gerado no seu celular ao realizar o login.
                  </p>
                </div>
              </div>
              <label className={styles.toggle}>
                <input 
                  type="checkbox" 
                  checked={twoFactor} 
                  onChange={(e) => setTwoFactor(e.target.checked)} 
                />
                <span className={styles.slider}></span>
              </label>
            </div>
            <div className={styles.actions}>
              <Button variant="primary" onClick={handleSaveSecurity}>Salvar Segurança</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
}
