export interface IEquipment {
  Id?: string;
  Nome: string;
  CodigoPatrimonio: string;
  Status?: string;
  DataAquisicao: Date | string;
  ObraId?: string | null;
}
