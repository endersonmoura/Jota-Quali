export interface SolicitarCalibracaoDTO {
  equipamentoId: string;
  tipo: "EXTERNA" | "INTERNA";
  prazoRetornoDias: number;
  solicitanteId: string;
}

export interface RegistrarCalibracaoInternaDTO {
  equipamentoId: string;
  equipamentoReferenciaId: string;
  dataCalibracao: Date;
  validade: Date;
  calibradorId: string;
}
