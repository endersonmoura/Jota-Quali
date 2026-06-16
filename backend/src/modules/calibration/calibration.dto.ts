export interface SolicitarCalibracaoDTO {
  equipamentoId: number;
  tipo: "EXTERNA" | "INTERNA";
  prazoRetornoDias: number;
  solicitanteId: number;
}

export interface RegistrarCalibracaoInternaDTO {
  equipamentoId: number;
  equipamentoReferenciaId: number;
  dataCalibracao: Date;
  validade: Date;
  calibradorId: number;
  cpfResponsavel: string;
  tipoLocal: "laboratorio" | "campo";
}
