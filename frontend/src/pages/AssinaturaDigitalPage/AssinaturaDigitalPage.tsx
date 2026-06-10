import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FileSignature, CheckCircle, ArrowLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { useEquipamentos } from "@/features/equipamentos/hooks/useEquipamentos";
import { useAuth } from "@/features/auth/hooks/useAuth";
import styles from "./AssinaturaDigitalPage.module.css";

export default function AssinaturaDigitalPage() {
  useDocumentTitle("Assinatura Digital GOV.BR");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, update } = useEquipamentos();

  const eqId = searchParams.get("eqId");
  const equipamento = items.find((e) => e.id === eqId);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  // Redireciona se não for admin
  useEffect(() => {
    if (user && user.role !== "admin") {
      toast.error("Acesso negado. Apenas administradores podem assinar laudos.");
      navigate("/laudos");
    }
  }, [user, navigate]);

  if (!equipamento) {
    return (
      <>
        <PageHeader eyebrow="Qualidade" title="Assinatura Digital" subtitle="Integração GOV.BR" />
        <div className={styles.section}>
          <div className={styles.card}>
            <p>Nenhum equipamento selecionado para assinatura ou equipamento não encontrado.</p>
            <Button variant="secondary" onClick={() => navigate("/laudos")} style={{ marginTop: "1rem" }}>
              Voltar para Laudos
            </Button>
          </div>
        </div>
      </>
    );
  }

  // --- GUIA DE INTEGRAÇÃO REAL COM A API GOV.BR ---
  //
  // Para substituir esta simulação pela integração real com o GOV.BR, o fluxo deve ser:
  //
  // 1. O botão "Assinar com GOV.BR" deve redirecionar o usuário para a rota de autorização OAuth do GOV.BR:
  //    URL: `https://sso.acesso.gov.br/authorize?response_type=code&client_id=${SEU_CLIENT_ID}&scope=sign&redirect_uri=${SUA_REDIRECT_URI}`
  //
  // 2. Após o usuário fazer login no GOV.BR e autorizar a assinatura, o GOV.BR redirecionará de volta para SUA_REDIRECT_URI 
  //    (que pode ser esta mesma página ou um endpoint no backend) passando um parâmetro `?code=XYZ`.
  //
  // 3. O Frontend captura esse `code` na URL e envia para o SEU BACKEND.
  //
  // 4. O SEU BACKEND fará:
  //    - Troca do `code` por um `access_token` batendo no endpoint `/token` do GOV.BR.
  //    - Geração do Hash SHA-256 do arquivo PDF do Laudo.
  //    - Envio do Hash e do `access_token` para a API de Assinatura do GOV.BR (`https://assinatura-api.iti.gov.br/`).
  //    - O GOV.BR retorna a assinatura digital (formato PKCS#7 ou similar).
  //    - O Backend anexa essa assinatura ao PDF e salva no banco de dados, marcando como assinado.
  //
  // 5. O Backend responde com "Sucesso" e o Frontend exibe a tela de confirmação.

  const simulateGovBrSignature = async () => {
    setLoading(true);
    
    // Simula o tempo de redirecionamento, login no gov.br e retorno do callback
    await new Promise((resolve) => setTimeout(resolve, 2500));

    try {
      const today = new Date().toISOString().split("T")[0];
      
      // Atualiza o status do laudo e do equipamento
      update(equipamento.id, {
        ...equipamento,
        status: "ativo",
        laudoAssinado: true,
        statusLaudo: "assinado",
        ultimaCalibracao: today,
      });

      setSuccess(true);
      toast.success("Documento assinado digitalmente com sucesso via GOV.BR!");
    } catch (err) {
      toast.error("Ocorreu um erro na integração com o GOV.BR.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageHeader
        eyebrow="Qualidade"
        title="Assinatura GOV.BR"
        subtitle="Assinatura eletrônica com validade jurídica utilizando a plataforma do Governo Federal."
      />

      <div className={styles.section}>
        {success ? (
          <div className={styles.card}>
            <div className={styles.successIcon}>
              <CheckCircle size={32} />
            </div>
            <h2 className={styles.title}>Assinatura Concluída!</h2>
            <p className={styles.description}>
              O laudo do equipamento <strong>{equipamento.tag}</strong> foi assinado digitalmente e já está disponível no sistema com validade legal.
            </p>
            <Button
              variant="primary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate("/laudos")}
            >
              Voltar para a lista de Laudos
            </Button>
          </div>
        ) : (
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <FileSignature size={32} />
            </div>
            <h2 className={styles.title}>Revisão e Assinatura</h2>
            <p className={styles.description}>
              Você será redirecionado para o portal GOV.BR para realizar a assinatura avançada deste laudo técnico.
            </p>

            <div className={styles.detailsBox}>
              <div className={styles.detailsTitle}>Detalhes do Documento</div>
              <div className={styles.detailsContent}>
                <strong>Equipamento:</strong> {equipamento.tag} — {equipamento.nome} <br />
                <strong>Responsável Técnico:</strong> {user?.name} <br />
                <strong>Emissão:</strong> {new Date().toLocaleDateString("pt-BR")}
              </div>
            </div>

            <button
              className={styles.btnGovBr}
              onClick={simulateGovBrSignature}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Conectando ao GOV.BR...
                </>
              ) : (
                <>
                  <img
                    src="https://www.gov.br/++theme++padrao_govbr/img/govbr-logo-large.png"
                    alt="Logo GOV.BR"
                    style={{ height: "20px", filter: "brightness(0) invert(1)" }}
                  />
                  Assinar com GOV.BR
                </>
              )}
            </button>
            <div style={{ marginTop: "1rem" }}>
              <Button variant="ghost" onClick={() => navigate("/laudos")} disabled={loading}>
                Cancelar
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
