export interface EquipmentDTO {
  id?: number;
  codigo: string;
  descricao: string;
  tipo?: string;
  obraId?: number | null;
  status?: string;
  situacaoDocumental?: string;
  dataCadastro?: Date;
  dataUltimaCalibracao?: Date;
  dataVencimentoCalibracao?: Date;
  criadoPorId?: number;
}
