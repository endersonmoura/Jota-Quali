import { useRef, FormEvent } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FileSignature, CheckCircle, ArrowLeft, Loader2, Download, UploadCloud, Info } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/PageHeader/PageHeader";
import { Button } from "@/components/ui/Button/Button";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";
import { documentosService } from "@/features/laudos/services/documentosService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import styles from "./AssinaturaDigitalPage.module.css";
import { format } from "date-fns";

export default function AssinaturaDigitalPage() {
  useDocumentTitle("Assinatura de Laudo");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const docId = searchParams.get("docId");

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: document, isLoading: isLoadingDoc } = useQuery({
    queryKey: ["documento", docId],
    queryFn: () => documentosService.getById(Number(docId)),
    enabled: !!docId,
  });

  const assinarMutation = useMutation({
    mutationFn: (formData: FormData) => documentosService.assinar(formData),
    onSuccess: () => {
      toast.success("Documento assinado enviado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["documentos"] });
      queryClient.invalidateQueries({ queryKey: ["documento", docId] });
    },
    onError: (err) => {
      toast.error(err instanceof Error ? err.message : "Ocorreu um erro ao enviar o documento assinado.");
    },
  });

  if (!docId) {
    return (
      <>
        <PageHeader eyebrow="Qualidade" title="Assinatura de Laudo" subtitle="Upload de arquivo assinado" />
        <div className={styles.section}>
          <div className={styles.card}>
            <p>Nenhum documento selecionado para assinatura.</p>
            <Button variant="secondary" onClick={() => navigate("/laudos")} style={{ marginTop: "1rem" }}>
              Voltar para Laudos
            </Button>
          </div>
        </div>
      </>
    );
  }

  const handleUploadAssinado = (ev: FormEvent) => {
    ev.preventDefault();
    const file = fileInputRef.current?.files?.[0];
    
    if (!file) {
      toast.error("Por favor, selecione o arquivo PDF assinado.");
      return;
    }

    const formData = new FormData();
    formData.append("documentoId", docId);
    formData.append("arquivo_assinado", file);

    assinarMutation.mutate(formData);
  };

  const isSuccess = assinarMutation.isSuccess;
  const isAlreadySigned = document?.statusAssinatura;

  return (
    <>
      <PageHeader
        eyebrow="Qualidade"
        title="Assinatura de Laudo"
        subtitle="Processo manual de assinatura externa."
      />

      <div className={styles.section}>
        {isLoadingDoc ? (
          <div className={styles.card} style={{ minHeight: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Loader2 className="animate-spin" size={32} style={{ color: "var(--jq-primary)" }} />
          </div>
        ) : isSuccess || isAlreadySigned ? (
          <div className={styles.card}>
            <div className={styles.successIcon}>
              <CheckCircle size={32} />
            </div>
            <h2 className={styles.title}>Laudo Assinado</h2>
            <p className={styles.description}>
              {isSuccess ? "O laudo assinado foi salvo com sucesso no sistema." : "Este laudo já possui uma assinatura registrada no sistema."}
            </p>
            
            {document?.pathArquivo && (
              <div style={{ marginTop: "1rem", marginBottom: "2rem" }}>
                <a href={document.pathArquivo} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <Button variant="secondary" leftIcon={<Download size={16} />}>
                    Baixar Laudo Final
                  </Button>
                </a>
              </div>
            )}

            <Button
              variant="primary"
              leftIcon={<ArrowLeft size={16} />}
              onClick={() => navigate("/laudos")}
            >
              Voltar para a lista de Laudos
            </Button>
          </div>
        ) : document ? (
          <div className={styles.card}>
            <div className={styles.iconWrap}>
              <FileSignature size={32} />
            </div>
            <h2 className={styles.title}>Assinatura Externa</h2>
            
            <div style={{ backgroundColor: "var(--jq-bg-mute)", padding: "1rem", borderRadius: "8px", margin: "1rem 0", textAlign: "left", fontSize: "0.9rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem", color: "var(--jq-primary)", fontWeight: "600" }}>
                <Info size={16} /> Informações do Documento
              </div>
              <p><strong>Equipamento:</strong> {document.equipamento?.codigo} - {document.equipamento?.descricao}</p>
              <p><strong>Laboratório:</strong> {document.laboratorio || "N/A"}</p>
              <p><strong>Data de Emissão:</strong> {format(new Date(document.dataEmissao), "dd/MM/yyyy")}</p>
            </div>

            <p className={styles.description}>
              Siga os passos abaixo para assinar este laudo:
            </p>

            <div className={styles.detailsBox}>
              <ol style={{ textAlign: "left", lineHeight: "1.8" }}>
                <li><strong>Baixe o arquivo original</strong> clicando no botão abaixo.</li>
                <li><strong>Assine o documento</strong> utilizando o portal Gov.br, Adobe Sign ou seu certificado digital A1/A3.</li>
                <li><strong>Faça o upload do novo PDF assinado</strong> aqui nesta tela.</li>
              </ol>
            </div>

            {document.pathArquivo && (
              <div style={{ marginTop: "1rem" }}>
                <a href={document.pathArquivo} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <Button variant="secondary" leftIcon={<Download size={16} />}>
                    Baixar PDF Original
                  </Button>
                </a>
              </div>
            )}

            <form onSubmit={handleUploadAssinado} style={{ width: "100%", marginTop: "1.5rem" }}>
              <div style={{ marginBottom: "1.5rem", textAlign: "left" }}>
                <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
                  PDF Assinado
                </label>
                <input 
                  type="file" 
                  accept="application/pdf"
                  ref={fileInputRef}
                  required
                  style={{ 
                    width: "100%", 
                    padding: "0.5rem", 
                    border: "1px solid var(--jq-border)", 
                    borderRadius: "0.375rem" 
                  }}
                />
              </div>

              <div style={{ display: "flex", gap: "1rem", justifyContent: "center" }}>
                <Button variant="ghost" onClick={() => navigate("/laudos")} disabled={assinarMutation.isPending} type="button">
                  Cancelar
                </Button>
                <Button variant="primary" type="submit" disabled={assinarMutation.isPending} leftIcon={assinarMutation.isPending ? <Loader2 className="animate-spin" size={16}/> : <UploadCloud size={16}/>}>
                  {assinarMutation.isPending ? "Enviando..." : "Confirmar Envio"}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <div className={styles.card}>
            <p>Documento não encontrado ou indisponível.</p>
            <Button variant="secondary" onClick={() => navigate("/laudos")} style={{ marginTop: "1rem" }}>
              Voltar para Laudos
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
