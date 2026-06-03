export interface EquipmentDTO {
  Id?: string;
  Nome: string;
  CodigoPatrimonio: string;
  ObraId?: string | null;
  descricao: string;
  tipo: string;
  dataAquisicao?: Date;
  status?: "Disponivel" | "Em Manutencao" | "Calibracao" | "Inativo";
}
