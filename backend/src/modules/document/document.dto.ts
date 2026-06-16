export interface UploadLaudoDTO {
  equipamentoId: number;
  solicitacaoId?: number; // Opcional, vincula a uma solicitação aberta se houver
  laboratorio: string;
  dataEmissao: Date;
  dataValidade: Date;
  pathArquivo: string;
}

export interface AssinarDocumentoDTO {
  documentoId: number;
  assinanteId: number;
  ipOrigem?: string;
  pathArquivoAssinado: string;
}
